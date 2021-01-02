using DPM_Testing.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Configuration;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM_Testing.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationAPIController : ControllerBase
    {
        private UserManager<RegisterUser> _userManager;
        private SignInManager<RegisterUser> _singInManager;
        private readonly ApplicationSettings _appSettings;
        IConfiguration config;


        public RegistrationAPIController(UserManager<RegisterUser> userManager,
            SignInManager<RegisterUser> signInManager, IOptions<ApplicationSettings> appSettings
            , IConfiguration config_)
        {
            _userManager = userManager;
            _singInManager = signInManager;
            _appSettings = appSettings.Value;
            config = config_;
        }




        // GET: api/<RegistrationAPIController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<RegistrationAPIController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<RegistrationAPIController>

        //public void Post([FromBody] string value)
        //{
        //}
        [HttpPost]
        [Route("Register")]
        //POST : /api/RegistrationAPI/Register
        public async Task<IActionResult> Post(RegistrationModel model)
        {

            var registerUser = new RegisterUser()
            {
                UserName = model.UserName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Firstname = model.Firstname,
                Lastname = model.Lastname,
                Company = model.Company


            };

            try
            {
                var result = await _userManager.CreateAsync(registerUser, model.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Login")]
        //POST : /api/ApplicationUser/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID",user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var SecurityToken = tokenHandler.WriteToken(securityToken);
                return Ok(new { SecurityToken });
            }
            else
                return BadRequest(new { message = "Username or password is incorrect." });
        }


        // PUT api/<RegistrationAPIController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<RegistrationAPIController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
