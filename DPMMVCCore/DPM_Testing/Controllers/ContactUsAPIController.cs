using DPM_ServerSide.DAL;
using DPM_Testing.Models;
using EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM_Testing.Controllers
{
    [Authorize]
   // [EnableCors("MyAllowSpecificOrigins")]
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

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        [Route("ContactUs")]
        public async Task<ActionResult<ContactUs>> PostContactUs(ContactUs contactUs)
        {
            try
            {
                contactUs.To = "dprescripti@gmail.com";
                var subject = contactUs.Subject;
                var body = " From : " + contactUs.Email +"   " + " Message: " + contactUs.Comment;
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

        // PUT api/<ContactUsAPIController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ContactUsAPIController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
