using DPM_ServerSide.DAL;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DPM_Testing.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileAPIController : ControllerBase
    {
        private readonly DPMDal context;
        public UserProfileAPIController(DPMDal context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<Object> GetUserProfile()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await this.context.RegisterUsers.FirstOrDefaultAsync(a => a.UserId == userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }           
        }

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

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    string dbPath = string.Format("DPM_Profile_Images/{0}/{1}", UserId, fileName);
                    var user = await this.context.RegisterUsers.FirstOrDefaultAsync(a => a.UserId == UserId);
                    user.ImageUrl = dbPath;
                    context.Entry(user).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Position = 0;
                    }

                    return Ok(user);
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
        [HttpPut]
        public async Task<IActionResult> PutUserProfile(RegistrationModel model)
        {
            try
            {
                context.Entry(model).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
