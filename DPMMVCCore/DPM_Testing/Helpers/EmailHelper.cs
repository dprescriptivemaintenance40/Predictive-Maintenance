using System;
using System.Collections.Generic;
using System.Linq;
using DPM_Testing.Models;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace DPM_Testing.Helpers
{
    public class EmailHelper
    {
        private string _host;
        private string _from;
        private string _alias;
        private string _pass;
        private int _port;
        public EmailHelper(IConfiguration iConfiguration)
        {
            var smtpSection = iConfiguration.GetSection("SMTP");
            if (smtpSection != null)
            {
                _host = smtpSection.GetSection("Host").Value;
                _from = smtpSection.GetSection("From").Value;
                _pass = smtpSection.GetSection("Pass").Value;
                _alias = smtpSection.GetSection("Alias").Value;
                _port = Convert.ToInt32(smtpSection.GetSection("Port").Value);
            }
        }

        public void SendEmail(ContactUs emailModel)
        {
            try
            {
                var to = emailModel.To;
                var subject = emailModel.Subject;
                var body = emailModel.Comment;
                MailMessage mailMessage = new MailMessage();
                mailMessage.To.Add(to);
                mailMessage.Subject = subject;
                mailMessage.Body = body;
                mailMessage.From = new MailAddress(_from);
                mailMessage.IsBodyHtml = false;
                SmtpClient client = new SmtpClient(_host);
                client.Port = _port;
                client.UseDefaultCredentials = false;
                client.EnableSsl = true;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.Credentials = new System.Net.NetworkCredential(_from, _pass);
                client.Send(mailMessage);
            }
            catch
            {
                throw;
            }
        }
    }
}
