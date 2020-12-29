using DPM_ServerSide.DAL;
using DPM_Testing.Models;
using EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
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

        public ContactUsAPIController(IEmailSender emailSender, DPMDal context)
        {
            _context = context;
            _emailSender = emailSender;
        }

       
        //public ContactUsAPIController(EmailHelper emailHelper)
        //{
        //    _emailHelper = emailHelper;
        //}
        // GET: api/<ContactUsAPIController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ContactUsAPIController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ContactUsAPIController>
        [HttpPost]
        [Route("ContactUs")]
        //public void Post([FromBody] string value)
        //{
        //}

        public async Task<ActionResult<ContactUs>> PostContactUs(ContactUs contactUs)
        {
            try
            {
                //   _context.contactUs.Add(contactUs);
                //  await _context.SaveChangesAsync();

                //  _emailHelper.SendEmail(contactUs);
                var subject = contactUs.Subject;
                var body = contactUs.Comment;
                var message = new Message(new string[] { contactUs.To }, subject, body, null);

                await _emailSender.SendEmailAsync(message);
                _context.contactUs.Add(contactUs);
              //  await _context.SaveChangesAsync();
                return Ok("Message Sent");


            }
            catch (Exception)
            {

                throw;
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
