using System.Collections.Generic;

namespace SmartAgricultuer.ViewModels
{
    public class DiseaseTableViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PlantType { get; set; } 
        public string Symptoms { get; set; }  
        public string Status { get; set; }    
        public string ImageUrl { get; set; }  
    }
}