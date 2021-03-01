using DPM.Models.LoginRegistrationModel;
using DPM_Testing.Models;
using EmailService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DPM.Controllers.LoginRegistration
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForgotPasswordAPIController : ControllerBase
    {
        private readonly IEmailSender _emailSender;
        private UserManager<RegisterUser> _userManager;


        public ForgotPasswordAPIController(
            IEmailSender emailSender,
            UserManager<RegisterUser> userManager)
        {
            _emailSender = emailSender;
            _userManager = userManager;
        }

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
            var details = new { email = user.Email, userId = user.Id, token = token };
            var callback = "https://localhost:44331/#/Reset?token=" + details.token + "&userId=" + details.userId + "&email=" + details.email;
            var message = new Message(new string[] { forgotPasswordModel.Email }, "Reset password token", "Please confirm your account by clicking <a href=\"" + callback + "\">here</a>", null);
            await _emailSender.SendEmailAsync(message);
            return Ok(message);
        }



        [HttpGet]
        public IActionResult ResetPassword(string token, string email, string userId)
        {
            var model = new ResetPasswordModel { Token = token, Email = email, userId = userId };
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
    }
}
