using System;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models.Prescriptive
{
    public class AdvanceAccessModel
    {
        [Key]
        public int AdvanceAccessId { get; set; }
        public string UserId { get; set; }
        public string PageName { get; set; }

    }
}
