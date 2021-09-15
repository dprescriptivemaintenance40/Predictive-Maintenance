﻿using DPM_Testing.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using DPM_ServerSide.DAL;
using Microsoft.EntityFrameworkCore;
using DPM.Utilities;
using System.Linq;
using System.Collections.Generic;

namespace DPM_Testing.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationAPIController : ControllerBase
    {
        private readonly ApplicationSettings _appSettings;
        private readonly DPMDal context;

        public RegistrationAPIController(IOptions<ApplicationSettings> appSettings,
            DPMDal context)
        {
            _appSettings = appSettings.Value;
            this.context = context;
        }


        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Post(RegistrationModel model)
        {
            try
            {
                var user = await this.context.RegisterUsers.FirstOrDefaultAsync(a => a.UserName == model.UserName);
                if (user == null)
                {
                    model.CreatedDate = DateTime.Now;
                    model.UserId = Guid.NewGuid().ToString();
                    model.Password = EncryptDecryptPassword.Encrypt(model.Password, model.UserId.ToString());
                    this.context.RegisterUsers.Add(model);
                    await this.context.SaveChangesAsync();
                    return Ok(model);
                }
                else
                {
                    return BadRequest("This User is already registered with us!!!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            try
            {
                var user = await this.context.RegisterUsers.FirstOrDefaultAsync(a => a.UserName == model.UserName);                
                if (user != null)
                {
                    var testing = EncryptDecryptPassword.Encrypt(model.Password, user.UserId);
                    var password = EncryptDecryptPassword.Decrypt(user.Password, user.UserId);
                    if (password == model.Password)
                    {
                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = new ClaimsIdentity(new Claim[]
                            {
                        new Claim("UserID",user.UserId.ToString())
                            }),
                            Expires = DateTime.UtcNow.AddDays(1),
                            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                        };
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                        var SecurityToken = tokenHandler.WriteToken(securityToken);
                        return Ok(new { SecurityToken, user });
                    }
                    else
                    {
                        return BadRequest("Password is incorrect");
                    }
                }
                else
                {
                    return BadRequest("Username is incorrect.");
                }
            }
            catch (Exception ex)
            { 
                return BadRequest("Incorrect username or password");
            }
        }

        [HttpGet]
        [Route("RecordsByUserId")]
        public async Task<IActionResult> GetRecords(string UserId)
        {
            try
            {
                var registrationModel = await (from staff in this.context.RegisterUsers
                                                                   join designation in this.context.DesignationAccessModels
                                                                   on staff.DesignationId equals designation.DAId
                                                                   where staff.CreatedBy == UserId
                                                                   select new 
                                                                   {
                                                                       UserId = staff.UserId,
                                                                       Password = EncryptDecryptPassword.Decrypt(staff.Password, staff.UserId.ToString()),
                                                                       UserName = staff.UserName,
                                                                       CreatedBy = staff.CreatedBy,
                                                                       CreatedDate = staff.CreatedDate,
                                                                       FirstName = staff.FirstName,
                                                                       LastName = staff.LastName,
                                                                       Company = staff.Company,
                                                                       Email = staff.Email,
                                                                       PhoneNumber = staff.PhoneNumber,
                                                                       UserType = staff.UserType,
                                                                       ImageUrl = staff.ImageUrl,
                                                                       DesignationId = staff.DesignationId,
                                                                       DesignationName = designation.DesignationName,
                                                                       Dashborad = designation.Dashborad,
                                                                       TrainConfiguration = designation.TrainConfiguration,
                                                                       ScrewTrain = designation.ScrewTrain,
                                                                       ScrewPrediction = designation.ScrewPrediction,
                                                                       FMEA = designation.FMEA,
                                                                       RCM = designation.RCM,
                                                                       RCMConfiguration = designation.RCMConfiguration,
                                                                       RCA = designation.RCA,
                                                                       CBA = designation.CBA,
                                                                       AssesmentReport = designation.AssesmentReport,
                                                                       SkillLibrary = designation.SkillLibrary,
                                                                       UPD = designation.UPD,
                                                                       CCL = designation.CCL,
                                                                       RecycleBin = designation.RecycleBin,
                                                                   }).ToListAsync();

                return Ok(registrationModel);
            }
            catch (Exception exe)
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [Route("UpdateStaff")]
        public async Task<IActionResult> UpdateStaff(RegistrationModel registration)
        {
            try
            {
                registration.Password = EncryptDecryptPassword.Encrypt(registration.Password, registration.UserId.ToString());
                this.context.Entry(registration).State = EntityState.Modified;
                return Ok();
            }
            catch (Exception exe)
            {   
                return BadRequest();
            }
        }
    }
}
