using DPM_ServerSide.DAL;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class UserProfileAPIController : ControllerBase
    {
        private readonly DPMDal _context;
        private UserManager<RegisterUser> _userManager;
        public UserProfileAPIController(UserManager<RegisterUser> userManager, DPMDal context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: api/<UserProfileAPIController>
        [HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}
       
        public async Task<Object> GetUserProfile()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.Id,
                user.Firstname,
                user.Lastname,
                user.Email,
                user.PhoneNumber,
                user.UserName,
                user.Company
               
            };
        }



        // GET api/<UserProfileAPIController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<UserProfileAPIController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<UserProfileAPIController>/5
        [HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        public async Task<IActionResult> PutAddRuleModel(String Id, RegisterUser model)
        {
          //  string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(Id);


            user.UserName = model.UserName;
            user.Lastname = model.Lastname;
            user.Firstname = model.Firstname;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            user.Company = model.Company;

            // Apply the changes if any to the db
            await _userManager.UpdateAsync(user);

            return Ok(user);
        }

        // DELETE api/<UserProfileAPIController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
