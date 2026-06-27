using System.Collections.Generic;

namespace SmartAgricultuer.ViewModels
{
    public class PlantTableViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Scientific { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Diseases { get; set; } = new List<string>();
        public List<string> Insects { get; set; } = new List<string>();
    }
}