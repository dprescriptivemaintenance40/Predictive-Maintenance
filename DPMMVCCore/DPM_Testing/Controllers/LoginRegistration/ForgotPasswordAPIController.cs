using AutoMapper;
using DPM.Models.LoginRegistrationModel;
using DPM_Testing.Models;
using EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM.Controllers.LoginRegistration
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForgotPasswordAPIController : ControllerBase
    {
       // private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;
        private UserManager<RegisterUser> _userManager;
        private SignInManager<RegisterUser> _singInManager;
        private readonly ApplicationSettings _appSettings;
        IConfiguration config;
       


        public ForgotPasswordAPIController( IEmailSender emailSender, UserManager<RegisterUser> userManager,
                                            SignInManager<RegisterUser> signInManager, IOptions<ApplicationSettings> appSettings,
                                            IConfiguration config_ )
        {
          //  _mapper = mapper;
            _emailSender = emailSender;
            _userManager = userManager;
            _singInManager = signInManager;
            _appSettings = appSettings.Value;
            config = config_;
        }


        // GET: api/<ForgotPasswordAPIController>
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET api/<ForgotPasswordAPIController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ForgotPasswordAPIController>
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}


        [HttpPost]
        [Route("Forgot")]
        public async Task<IActionResult> Post(ForgotPasswordModel forgotPasswordModel)
        {
            if (!ModelState.IsValid)
                return Ok(forgotPasswordModel);
            var user = await _userManager.FindByEmailAsync(forgotPasswordModel.Email);
            if (user == null)
                return Ok();
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var details = new { email = user.Email, userId = user.Id, token = token};
            //  var callback = Url.Action(nameof(ResetPassword),"ForgotPasswordAPI", new { token, email = user.Email, userId = user.Id, }, Request.Scheme);
         
            var callback = "https://localhost:44331/#/Reset?token="+details.token+ "&userId="+details.userId+"&email="+details.email;

            //var callback = Url.Link("Default", new { email = user.Email, userId = user.Id, token = token });
            var message = new Message(new string[] { forgotPasswordModel.Email }, "Reset password token", "Please confirm your account by clicking <a href=\"" + callback + "\">here</a>", null);
            await _emailSender.SendEmailAsync(message);
            return Ok(message);
        }



        [HttpGet]
        public IActionResult ResetPassword(string token, string email, string userId)
        {
            
            var model = new ResetPasswordModel { Token = token, Email = email, userId= userId };
          
              return Ok(model);
           
           }




        [HttpPost]
        [Route("Reset")]
        public async Task<IActionResult> Post(ResetPasswordModel resetPasswordModel)
        {
            if (!ModelState.IsValid)
                return Ok(resetPasswordModel);

            var user = await _userManager.FindByEmailAsync(resetPasswordModel.Email);
            if (user == null)
                return Ok();

            var resetPassResult = await _userManager.ResetPasswordAsync(user, resetPasswordModel.Token, resetPasswordModel.Password);
            if (!resetPassResult.Succeeded)
            {
                foreach (var error in resetPassResult.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }

                return Ok();
            }

            return Ok();
        }




        // PUT api/<ForgotPasswordAPIController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ForgotPasswordAPIController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
