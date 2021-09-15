using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive
{
    public class UserSkillLibraryModel
    {
        [Key]
        public int SKillLibraryId { get; set; }
        public string UserId { get; set; }
        public int Craft { get; set; }
        public int EmpId { get; set; }
        public int Task { get; set; }
        public int Level { get; set; }
        public double HourlyRate { get; set; }
    }
}
