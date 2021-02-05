using DPM_ServerSide.DAL;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
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
                user.Company,
                user.ImageUrl
               
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
        [Route("UploadImage")]
        public async Task<Object> PostUploadImage()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("wwwroot\\DPM_Profile_Images\\");
                var rootPath = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var UserId = User.Claims.First(c => c.Type == "UserID").Value;
                string pathToSave = string.Format("{0}{1}", rootPath, UserId);
                // Check folder exists
                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }

                // Check file exists
                var profileImage = Directory.GetFiles(pathToSave).FirstOrDefault();
                if (profileImage != null)
                {
                    System.IO.DirectoryInfo directory = new DirectoryInfo(pathToSave);
                    foreach (FileInfo image in directory.GetFiles())
                    {
                        image.Delete();
                    }
                }

                if ( file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName );
                    string dbPath = string.Format("DPM_Profile_Images/{0}/{1}", UserId, fileName);
                    var user = await _userManager.FindByIdAsync(UserId);
                    user.ImageUrl = dbPath;
                    _context.Entry(user).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Position = 0;
                    }

                   

                    return Ok(new { dbPath });
                }
               
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }



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
