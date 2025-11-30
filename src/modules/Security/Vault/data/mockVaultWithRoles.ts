import { VaultModel } from '../models/VaultModel';

/**
 * Datos mock del Vault basados en la respuesta del API
 */
export const MOCK_VAULT_DATA: VaultModel = {
  myImages: [
    {
      id: 1,
      url: 'storage/59/images/1763587272__AZ__a26b4d5c-424f-48d3-9da9-38d7eaa1c28d.webp',
      type: 'vaul'
    },
    {
      id: 2,
      url: 'storage/global/business/1763590089___arancini-comida.jpg',
      type: 'vaul'
    }
  ],
  myVideos: [
    {
      id: 3,
      url: 'storage/59/videos/sample-video-1.mp4',
      type: 'vaul'
    },
    {
      id: 4,
      url: 'storage/59/videos/sample-video-2.mp4',
      type: 'vaul'
    }
  ],
  vaul: [
    {
      name: 'Booking',
      order: 0,
      multimedias: [
        { url: 'storage/vaul/restaurant/Ambientes/pexels-ahmed-abd-allah-4393137-19030111.jpg', order: 0 },
        { url: 'storage/vaul/restaurant/Ambientes/pexels-ann-plask-478490674-16046683.jpg', order: 1 },
        { url: 'storage/vaul/restaurant/Ambientes/pexels-antoine-maurin-264851287-27169579.jpg', order: 2 },
        { url: 'storage/vaul/restaurant/Ambientes/pexels-bianca-jelezniac-38713659-8916527.jpg', order: 3 },
        { url: 'storage/vaul/restaurant/Ambientes/pexels-dilankusanc-12492412.jpg', order: 4 },
        { url: 'storage/vaul/restaurant/Ambientes/pexels-duartefotografia-26626726.jpg', order: 5 }
      ]
    },
    {
      name: 'Technological',
      order: 1,
      multimedias: [
        { url: 'storage/vaul/rubros/Tecnologia__min/alex-kotliarskyi-ourQHRTE2IM-unsplash.webp', order: 0 },
        { url: 'storage/vaul/rubros/Tecnologia__min/alex-kotliarskyi-QBpZGqEMsKg-unsplash.webp', order: 1 },
        { url: 'storage/vaul/rubros/Tecnologia__min/altumcode-FoTs3ntRoIs-unsplash.webp', order: 2 },
        { url: 'storage/vaul/rubros/Tecnologia__min/andrew-neel-cckf4TsHAuw-unsplash.webp', order: 3 },
        { url: 'storage/vaul/rubros/Tecnologia__min/christina-wocintechchat-com-glRqyWJgUeY-unsplash.webp', order: 4 }
      ]
    },
    {
      name: 'Medical',
      order: 2,
      multimedias: [
        { url: 'storage/vaul/rubros/Servicios_Medicos__min/abdulai-sayni-zXpwZN7rnZY-unsplash.webp', order: 0 },
        { url: 'storage/vaul/rubros/Servicios_Medicos__min/adrian-sulyok-Lml7-1GFaI0-unsplash.webp', order: 1 },
        { url: 'storage/vaul/rubros/Servicios_Medicos__min/akram-huseyn-NPP0qXVIGDQ-unsplash.webp', order: 2 },
        { url: 'storage/vaul/rubros/Servicios_Medicos__min/alexandr-podvalny-tE7_jvK-_YU-unsplash.webp', order: 3 }
      ]
    },
    {
      name: 'Dentist',
      order: 3,
      multimedias: [
        { url: 'storage/vaul/rubros/Consultorio_Dental__min/alexander-krivitskiy-yIitNO2Bgdo-unsplash.webp', order: 0 },
        { url: 'storage/vaul/rubros/Consultorio_Dental__min/amir-seilsepour-jDem8tPXwOA-unsplash.webp', order: 1 },
        { url: 'storage/vaul/rubros/Consultorio_Dental__min/atikah-akhtar-XJptUS8nbhs-unsplash.webp', order: 2 }
      ]
    },
    {
      name: 'Psychologist',
      order: 4,
      multimedias: [
        { url: 'storage/vaul/rubros/Consultorio_Psicologico__min/alexandre-dinaut-pgYPX-Cy3iE-unsplash.webp', order: 0 },
        { url: 'storage/vaul/rubros/Consultorio_Psicologico__min/ali-nurmemmedov-hIxJL5xLe-0-unsplash.webp', order: 1 },
        { url: 'storage/vaul/rubros/Consultorio_Psicologico__min/alina-grubnyak-tEVGmMaPFXk-unsplash.webp', order: 2 }
      ]
    }
  ]
};
