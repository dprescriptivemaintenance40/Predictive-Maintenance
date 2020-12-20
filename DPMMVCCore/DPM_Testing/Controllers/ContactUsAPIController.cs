using DPM_Testing.DAL;
using DPM_Testing.Helpers;
using DPM_Testing.Models;
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

        public ContactUsAPIController(DPMDal context, EmailHelper emailHelper)
        {
            _context = context;
            _emailHelper = emailHelper;
        }

        private EmailHelper _emailHelper;
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
        //public void Post([FromBody] string value)
        //{
        //}

        public async Task<ActionResult<ContactUs>> PostContactUs(ContactUs contactUs)
        {
            try
            {
                //   _context.contactUs.Add(contactUs);
                //  await _context.SaveChangesAsync();

                _emailHelper.SendEmail(contactUs);
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
