import type { ServicesTreatmentsCopy } from '../../../../interfaces/services';

export const enServicesTreatmentsCopy: ServicesTreatmentsCopy = {
  eyebrow: 'Our treatments',
  heading: 'The right care for every vehicle',
  description:
    'Choose complete vehicle care, focused interior or exterior treatment, headlight restoration, or an ozone treatment for stubborn odors.',
  includedLabel: 'Included services',
  detailLinkLabel: 'Learn more',
  benefitsLabel: 'Your benefits',
  processLabel: 'How the treatment works',
  backLabel: 'Back to all services',
  bookLabel: 'Book an appointment',
  bookLink: '/book',
  notFoundTitle: 'Service not found',
  items: [
    {
      slug: 'total-treatment',
      title: 'Total Treatment',
      description: 'A complete inside-and-out refresh for cars that need the full Poets Anders finish.',
      longDescription:
        'The Total Treatment combines deep interior cleaning with careful exterior care. Every important surface is handled systematically so the cabin feels fresh and the exterior regains a clean, consistent finish.',
      image: '/beautiful-car-washing-service.jpg',
      services: ['Interior treatment', 'Exterior treatment'],
      benefits: ['Complete care in one appointment', 'Coordinated interior and exterior work', 'Ideal for heavily used vehicles'],
      process: ['Inspect the vehicle together', 'Clean the interior thoroughly', 'Wash, polish, and protect the exterior', 'Complete a final quality check'],
      details: {
        sections: [
          {
            heading: 'Let your car shine inside and out again',
            paragraphs: [
              'Is your car\'s paint no longer as glossy as it once was, and has the interior become dirty or dull? The Poets Anders Total Treatment combines professional interior and exterior care so the complete vehicle looks fresh and well maintained again.',
              'Inside the car, we clean suitable upholstery and treat plastic surfaces for a neat, refreshed cabin. The treatment is adapted to the materials and condition of the interior.',
            ],
          },
          {
            heading: 'Complete exterior care',
            paragraphs: [
              'The exterior is thoroughly refreshed from paint to wheels. Depending on the vehicle\'s condition, the work includes coarse and fine polishing, hand wax, rim cleaning, tire treatment, and paint protection.',
              'Suitable lettering or stickers can also be removed professionally. We inspect the paint first because the surface underneath older stickers may differ from the surrounding finish.',
            ],
          },
        ],
        odorsHeading: 'What do we do during the Total Treatment?',
        odorsDescription: 'The complete treatment combines these interior and exterior services:',
        odors: [
          'Interior treatment',
          'Clean suitable upholstery',
          'Plastic treatment',
          'Exterior treatment',
          'Coarse polishing',
          'Fine polishing',
          'Hand wax',
          'Clean rims',
          'Tire treatment',
          'Paint protection',
          'Professional sticker removal',
        ],
        priceLabel: 'Treatment from',
        price: '€135',
        ctaHeading: 'Let your car shine inside and out',
        safetyNote:
          'The exact scope and final price depend on the vehicle size, materials, level of soiling, and paint condition. We assess the car before starting.',
      },
    },
    {
      slug: 'interior-treatment',
      title: 'Interior Treatment',
      description:
        'Deep cabin care focused on comfort, freshness, and the surfaces you touch every day.',
      longDescription:
        'The Interior Treatment thoroughly cleans seats, carpets, plastics, and frequently touched areas. The work is adapted to the materials and level of soiling so the cabin returns clean, fresh, and cared for.',
      image: '/Image_wash.jpg',
      services: ['Clean upholstery', 'Odor treatment', 'Treat plastic'],
      benefits: ['A noticeably fresher cabin', 'Material-appropriate cleaning', 'More everyday comfort'],
      process: ['Inspect the cabin and materials', 'Remove loose dirt and debris', 'Clean upholstery, carpets, and plastics', 'Condition surfaces and check the result'],
      details: {
        sections: [
          {
            heading: 'Your interior as good as new',
            paragraphs: [
              'Does your car interior look dirty, dull, or grey? The Interior Treatment gives the cabin a thorough refresh so it feels clean, comfortable, and cared for again.',
              'We begin by inspecting and cleaning the upholstery. With modern extraction equipment, we treat more than the visible surface and remove embedded dirt from deeper within suitable fabric upholstery.',
            ],
          },
          {
            heading: 'Fresh care for interior plastics',
            paragraphs: [
              'Dashboard panels, door trim, the center console, and other plastic surfaces are cleaned and treated for a fresh, even appearance.',
              'The treatment is adapted to the materials and condition of the interior. Delicate surfaces are handled carefully, and the finished cabin is checked before the vehicle is returned.',
            ],
          },
          {
            heading: 'Clean upholstery',
            paragraphs: [
              'If you want your car interior and upholstery professionally cleaned, Poets Anders provides careful treatment for seats and suitable fabric surfaces. We clean the visible surface and use extraction equipment to reach dirt held deeper within the upholstery.',
              'A car interior is used intensively. Food and drinks, children, pets, work equipment, and everyday travel can leave stains and odors behind. Professional upholstery cleaning helps restore a neat appearance, while an optional ozone treatment can address persistent smells after the cleaning work is complete.',
              'Alongside upholstery cleaning, we can also clean the wider cabin, treat plastic surfaces, and professionally remove suitable stickers or adhesive residue.',
            ],
          },
          {
            heading: 'Plastic treatment',
            paragraphs: [
              'Over time, interior plastic can become grey, dusty, and dull. We safely clean and treat dashboards, door panels, consoles, and other suitable plastic parts so they regain a fresh and even appearance.',
              'The products and method are selected for the material being treated. The work can be combined with upholstery, rim, or headlight care for a more complete vehicle refresh.',
              'Ask us about available collection and return options when arranging your appointment.',
            ],
          },
        ],
        odorsHeading: 'What do we treat during the Interior Treatment?',
        odorsDescription: 'The treatment focuses on the main surfaces that determine how clean and fresh the cabin feels:',
        odors: [
          'Clean suitable fabric upholstery',
          'Deep-clean embedded upholstery dirt',
          'Clean carpets and accessible cabin surfaces',
          'Clean and treat interior plastics',
          'Refresh frequently touched areas',
          'Optional ozone treatment for persistent odors',
          'Professional removal of suitable stickers',
        ],
        priceLabel: 'Treatment from',
        price: '€95',
        ctaHeading: 'Make your interior look fresh again',
        safetyNote:
          'Drying time depends on the material, weather, and level of deep cleaning required. Existing stains or permanent material damage may not be removable completely.',
      },
    },
    {
      slug: 'exterior-treatment',
      title: 'Exterior Treatment',
      description: 'Paint, wheels, tires, and finish treated step by step for a clean premium look.',
      longDescription:
        'The Exterior Treatment removes bonded dirt and restores the paint in careful stages. Polishing, hand wax, wheel cleaning, and tire care create more gloss and a balanced, well-kept appearance.',
      image: '/hero_Image.jpg',
      services: ['Coarse polishing', 'Fine polishing', 'Hand wax', 'Rim cleaning', 'Tire treatment'],
      benefits: ['More gloss and color depth', 'A cleaner overall appearance', 'Protection from the final hand wax'],
      process: ['Inspect paint and exterior surfaces', 'Pre-clean the vehicle gently', 'Coarse and fine polish the paint', 'Apply wax and complete the finish'],
      details: {
        sections: [
          {
            heading: 'Let your car shine again',
            paragraphs: [
              'Is your car\'s appearance no longer what it used to be? The Exterior Treatment restores gloss and gives the vehicle a fresh, well-kept finish that recalls its showroom appearance.',
              'We care for the complete exterior by polishing the paint, applying hand wax, cleaning the rims, and treating the tires. Additional paint protection helps protect the renewed finish against environmental influences and everyday contamination.',
            ],
          },
          {
            heading: 'Professional sticker removal',
            paragraphs: [
              'Old lettering, decals, and stickers can make a vehicle look dated or leave visible adhesive residue. On request, we can remove suitable stickers professionally and clean the affected areas so the exterior looks consistent again.',
              'The condition and age of the paint beneath a sticker may differ from the surrounding surface. We therefore inspect the area before removal and discuss the expected result with you.',
            ],
          },
        ],
        odorsHeading: 'What do we do during the Exterior Treatment?',
        odorsDescription: 'The treatment can include the following exterior care steps:',
        odors: [
          'Coarse polishing',
          'Fine polishing',
          'Hand wax',
          'Clean rims',
          'Tire treatment',
          'Paint protection',
          'Professional sticker removal',
        ],
        priceLabel: 'Treatment from',
        price: '€95',
        ctaHeading: 'Make your car look like new again',
        safetyNote:
          'The exact treatment is matched to the condition of the paint. Deep scratches, stone chips, and paint damage may require repair rather than polishing.',
      },
    },
    {
      slug: 'headlight-treatment',
      title: 'Headlight Treatment',
      description:
        'Your headlights become clear again, improving the look of the front end and visibility at night.',
      longDescription:
        'Cloudy or yellowed headlights are restored in controlled stages. The surface is prepared, refined, and polished for clarity, improving the appearance of the front end and helping light pass through more effectively.',
      image: '/bg_heroo.jpg',
      services: ['Restore a clear finish'],
      benefits: ['Clearer headlight surfaces', 'A cleaner-looking front end', 'Improved light output after dark'],
      process: ['Inspect the headlights', 'Protect the surrounding bodywork', 'Restore the surface in stages', 'Check clarity and finish'],
      details: {
        sections: [
          {
            heading: 'Make dull plastic headlights clear again',
            paragraphs: [
              'Have your car\'s headlights become cloudy, yellowed, or less bright? Reduced light output affects both the appearance of your vehicle and visibility in the dark. Poets Anders restores plastic headlights by polishing the weathered surface.',
              'Replacing complete headlight units can be expensive. With professional equipment, modern materials, and a careful multi-stage process, existing plastic headlights can often be restored for a fraction of the replacement cost.',
            ],
          },
          {
            heading: 'Why do headlights become dull?',
            paragraphs: [
              'Modern headlights are generally made from transparent plastic with a protective coating. During normal use, ultraviolet radiation, road dirt, moisture, acid rain, and other environmental influences gradually damage and discolor this coating.',
              'Fine scratches and oxidation develop in the plastic over time. The result is a dull or yellowed surface that looks neglected and allows less light to pass through.',
            ],
          },
          {
            heading: 'We restore your headlights',
            paragraphs: [
              'Weathered headlights are carefully prepared, refined, and polished in several stages. The aim is to restore a clear, even surface and improve the appearance and useful light output of the existing units.',
              'Severely weathered headlights may also cause problems during a vehicle inspection. Restoration is often a considerably more affordable option than replacing the complete headlight.',
            ],
          },
        ],
        odorsHeading: 'Benefits of headlight polishing',
        odorsDescription: 'Professional restoration offers several practical advantages:',
        odors: [
          'Clearer plastic surfaces',
          'Improved light output',
          'Better visibility in the dark',
          'A cleaner vehicle appearance',
          'More affordable than replacement',
          'Suitable for weathered and yellowed headlights',
        ],
        priceLabel: 'Treatment from',
        price: '€50 per headlight',
        ctaHeading: 'Make your headlights clear again',
        safetyNote:
          'The final result depends on the depth of the damage and the condition of the plastic. We inspect each headlight before starting the treatment.',
      },
    },
    {
      slug: 'ozone-treatment',
      title: 'Ozone Treatment',
      description:
        'An intensive ozone treatment neutralizes stubborn smoke smells and other unpleasant odors inside your vehicle.',
      longDescription:
        'The Ozone Treatment is intended for persistent smoke, pet, or musty odors. After preparing the cabin, ozone is used in a controlled closed-vehicle treatment before the car is thoroughly ventilated.',
      image: '/Image_wash.jpg',
      services: ['Neutralize smoke smells', 'Remove unpleasant odors'],
      benefits: ['Reaches difficult cabin areas', 'Neutralizes instead of masking odors', 'Suitable for smoke and strong foreign smells'],
      process: ['Inspect the odor source and cabin', 'Prepare the vehicle for treatment', 'Allow ozone to work under controlled conditions', 'Ventilate thoroughly and complete a final check'],
      details: {
        sections: [
          {
            heading: 'Get rid of bad odors with an ozone treatment',
            paragraphs: [
              'Do you have persistent odors in your car from cigarette smoke, pets, moisture, or spilled drinks? Poets Anders uses a professional ozone treatment to neutralize the source of unwanted smells and help the interior smell clean and fresh again.',
              'Unlike products that temporarily cover an odor, ozone circulates through the cabin and ventilation system. This allows the treatment to reach air ducts and other areas that are difficult to clean by hand.',
            ],
          },
          {
            heading: 'What is ozone?',
            paragraphs: [
              'Ozone (O3) is a form of oxygen that also occurs naturally in the atmosphere. It is a reactive gas that can break down odor-causing compounds. Because ozone is unstable, it naturally converts back into oxygen after treatment.',
            ],
          },
          {
            heading: 'How do we proceed?',
            paragraphs: [
              'The required treatment time depends on the type and intensity of the odor. Smoke, stagnant rainwater, animal odors, mold, and spilled liquids may each require a different treatment cycle.',
              'The ozone generator is placed in the vehicle and operated for a carefully selected period while the air circulation system distributes the gas throughout the cabin and air ducts. The vehicle is then thoroughly ventilated and checked before it is returned.',
            ],
          },
        ],
        odorsHeading: 'What bad smells can we remove?',
        odorsDescription: 'The treatment can help neutralize many persistent vehicle odors, including:',
        odors: [
          'Cigarette smoke',
          'Pet odors',
          'Odors in the air circulation system',
          'Stagnant rainwater',
          'Mold after a leak',
          'Spilled drinks',
          'Vomit',
          'Body odors',
          'Burning smells',
        ],
        priceLabel: 'Treatment from',
        price: '€50',
        ctaHeading: 'Remove bad odors from your car',
        safetyNote:
          'Ozone treatment is carried out in a closed, unoccupied vehicle. The car is thoroughly ventilated before it is ready for use again.',
      },
    },
  ],
};
