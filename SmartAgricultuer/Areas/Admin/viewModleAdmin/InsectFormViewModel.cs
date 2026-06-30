using System.Collections.Generic;

namespace SmartAgricultuer.ViewModelsAdmin
{
    public class InsectFormViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ScientificName { get; set; }
        public string Status { get; set; }
        public List<string> AffectedPlants { get; set; }
        public string DamageDescription { get; set; }
        public string PreventionMethod { get; set; }
        public string ImageBase64 { get; set; }
    }
}