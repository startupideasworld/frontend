import { asyncDebonce } from "./helpers";

export type AddressPrediction = google.maps.places.AutocompletePrediction;

// This example retrieves autocomplete predictions programmatically from the
// autocomplete service, and displays them as an HTML list.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function _searchPlaces(
  text: string,
  limit?: ("(cities)" | "(regions)" | "country")[]
): Promise<AddressPrediction[]> {
  const service = new google.maps.places.AutocompleteService();
  let query: google.maps.places.AutocompletionRequest = { input: text };
  if (limit) {
    query.types = limit;
  }
  return new Promise((resolve, reject) => {
    service.getPlacePredictions(query, (data) => {
      if (data instanceof Array) {
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
}

export const searchPlaces = asyncDebonce(_searchPlaces, 500);

export const defaultAddressPredictions: AddressPrediction[] = [
  {
    description: "New York, NY, USA",
    matched_substrings: [
      {
        length: 8,
        offset: 0,
      },
      {
        length: 2,
        offset: 10,
      },
      {
        length: 3,
        offset: 14,
      },
    ],
    place_id: "ChIJOwg_06VPwokRYv534QaPC8g",
    reference: "ChIJOwg_06VPwokRYv534QaPC8g",
    structured_formatting: {
      main_text: "New York",
      main_text_matched_substrings: [
        {
          length: 8,
          offset: 0,
        },
      ],
      secondary_text: "NY, USA",
      secondary_text_matched_substrings: [
        {
          length: 2,
          offset: 0,
        },
        {
          length: 3,
          offset: 4,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: "New York",
      },
      {
        offset: 10,
        value: "NY",
      },
      {
        offset: 14,
        value: "USA",
      },
    ],
    types: ["locality", "political", "geocode"],
  },
  {
    description: "Niagara Falls, NY, USA",
    matched_substrings: [
      {
        length: 13,
        offset: 0,
      },
      {
        length: 2,
        offset: 15,
      },
      {
        length: 3,
        offset: 19,
      },
    ],
    place_id: "ChIJtzPmKepj04kRs6rFueRal2E",
    reference: "ChIJtzPmKepj04kRs6rFueRal2E",
    structured_formatting: {
      main_text: "Niagara Falls",
      main_text_matched_substrings: [
        {
          length: 13,
          offset: 0,
        },
      ],
      secondary_text: "NY, USA",
      secondary_text_matched_substrings: [
        {
          length: 2,
          offset: 0,
        },
        {
          length: 3,
          offset: 4,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: "Niagara Falls",
      },
      {
        offset: 15,
        value: "NY",
      },
      {
        offset: 19,
        value: "USA",
      },
    ],
    types: ["locality", "political", "geocode"],
  },
  {
    description: "Northville, NY, USA",
    matched_substrings: [
      {
        length: 10,
        offset: 0,
      },
      {
        length: 2,
        offset: 12,
      },
      {
        length: 3,
        offset: 16,
      },
    ],
    place_id: "ChIJR2XJ1yVU3okR2eFqiBu-aO4",
    reference: "ChIJR2XJ1yVU3okR2eFqiBu-aO4",
    structured_formatting: {
      main_text: "Northville",
      main_text_matched_substrings: [
        {
          length: 10,
          offset: 0,
        },
      ],
      secondary_text: "NY, USA",
      secondary_text_matched_substrings: [
        {
          length: 2,
          offset: 0,
        },
        {
          length: 3,
          offset: 4,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: "Northville",
      },
      {
        offset: 12,
        value: "NY",
      },
      {
        offset: 16,
        value: "USA",
      },
    ],
    types: ["locality", "political", "geocode"],
  },
  {
    description: "Plattsburgh, NY, USA",
    matched_substrings: [
      {
        length: 11,
        offset: 0,
      },
      {
        length: 2,
        offset: 13,
      },
      {
        length: 3,
        offset: 17,
      },
    ],
    place_id: "ChIJ136l6Kg4ykwRFXRTxaHosLU",
    reference: "ChIJ136l6Kg4ykwRFXRTxaHosLU",
    structured_formatting: {
      main_text: "Plattsburgh",
      main_text_matched_substrings: [
        {
          length: 11,
          offset: 0,
        },
      ],
      secondary_text: "NY, USA",
      secondary_text_matched_substrings: [
        {
          length: 2,
          offset: 0,
        },
        {
          length: 3,
          offset: 4,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: "Plattsburgh",
      },
      {
        offset: 13,
        value: "NY",
      },
      {
        offset: 17,
        value: "USA",
      },
    ],
    types: ["locality", "political", "geocode"],
  },
  {
    description: "Greenville, NY, USA",
    matched_substrings: [
      {
        length: 10,
        offset: 0,
      },
      {
        length: 2,
        offset: 12,
      },
      {
        length: 3,
        offset: 16,
      },
    ],
    place_id: "ChIJf0P-ciLG3YkRHB3UrceTzf0",
    reference: "ChIJf0P-ciLG3YkRHB3UrceTzf0",
    structured_formatting: {
      main_text: "Greenville",
      main_text_matched_substrings: [
        {
          length: 10,
          offset: 0,
        },
      ],
      secondary_text: "NY, USA",
      secondary_text_matched_substrings: [
        {
          length: 2,
          offset: 0,
        },
        {
          length: 3,
          offset: 4,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: "Greenville",
      },
      {
        offset: 12,
        value: "NY",
      },
      {
        offset: 16,
        value: "USA",
      },
    ],
    types: ["locality", "political", "geocode"],
  },
];
