using DPM_ServerSide.DAL;
using DPM_Testing.Models;
using EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace DPM_Testing.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ContactUsAPIController : ControllerBase
    {
        private readonly DPMDal _context;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration configuration;

        public ContactUsAPIController(IEmailSender emailSender, DPMDal context,
            IConfiguration configuration)
        {
            _context = context;
            _emailSender = emailSender;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("ContactUs")]
        public async Task<ActionResult<ContactUs>> PostContactUs(ContactUs contactUs)
        {
            try
            {
                contactUs.To = "dprescripti@gmail.com";
                var subject = contactUs.Subject;
                var body = " From : " + contactUs.Email + "   " + " Message: " + contactUs.Comment;
                var message = new Message(new string[] { contactUs.To }, subject, body, null);
                await _emailSender.SendEmailAsync(message);
                _context.contactUs.Add(contactUs);
                _context.SaveChanges();
                return Ok("Message Sent");
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }
    }
}
