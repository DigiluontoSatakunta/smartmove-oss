import {Marker, Tooltip} from "react-leaflet";

import styles from "../../styles/Marker.module.css";

const LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: "",
    iconSize: [32, 32],
    shadowSize: [0, 0],
    iconAnchor: [32, 32],
    shadowAnchor: [0, 0],
    popupAnchor: [0, 0],
  },
});

const weatherStationIcon = new LeafIcon({
  iconUrl: "weatherStation.svg",
  className: styles.weatherStationMarker,
});

const weatherStationActiveIcon = new LeafIcon({
  iconUrl: "weatherStation.svg",
  className: styles.activeMarker,
});

export const sites = [
  {
    id: 4,
    name: "Kankaanpää, Niinisalo",
    influxName: "Kankaanpää_Niinisalo_lentokenttä",
    coordinates: [61.84, 22.46],
    areas: [
      2895, 2869, 2905, 2851, 2900, 2880, 2874, 2907, 2883, 2843, 3133, 3140,
      2894, 2896, 2884, 2797, 2889, 2913, 2901, 2801, 2849, 2864, 2879, 2865,
      3136, 2911, 2870, 2803, 2890, 2903, 2800, 2876, 2885, 2802, 2902, 2857,
      2806, 2892, 3142, 2917, 3139, 2909, 2850, 2866, 2860, 2918, 2877, 2787,
      2914, 2846, 2867, 2875, 2910, 3137, 2878, 2863, 2906, 2916, 2912, 2873,
      2891, 2899, 2886, 2871, 2908, 2882, 3134, 2915, 2893, 2868, 2788, 2897,
      2887, 2881, 2904, 2852, 2799, 2898, 2888, 3141, 2858,
    ],
    __typename: "WeatherStation",
  },
  {
    id: 5,
    name: "Karvia, Alkkia",
    influxName: "Karvia_Alkkia",
    coordinates: [62.18, 22.8],
    areas: [2792, 2794, 2795, 2796, 2791, 2793, 2805, 2798, 2804],
    __typename: "WeatherStation",
  },
  {
    id: 7,
    name: "Kokemäki, Tulkkila",
    influxName: "Kokemäki_Tulkkila",
    coordinates: [61.25, 22.35],
    areas: [
      4411, 4435, 4513, 4559, 3144, 4445, 4492, 4591, 4446, 4479, 4447, 4583,
      4400, 4395, 4558, 4460, 4553, 4480, 4490, 4582, 4502, 4528, 4450, 4518,
      4457, 4525, 4556, 4488, 4407, 4520, 4598, 4557, 4526, 4456, 4586, 4449,
      4550, 4443, 4590, 4475, 4501, 4477, 4405, 4442, 4506, 4452, 4464, 4551,
      4581, 4519, 4527, 4474, 4600, 4529, 4402, 4493, 4579, 4504, 4595, 4555,
      4561, 4554, 4596, 4580, 4603, 4408, 4463, 4458, 4521, 4396, 4594, 4406,
      4499, 4476, 4394, 4482, 4441, 4549, 4412, 4508, 4409, 4599, 4436, 4478,
      4587, 4487, 4403, 4401, 4451, 4505, 4511, 4503, 4437, 4439, 4515, 4507,
      4510, 4514, 4516, 4485, 4438, 4584, 4522, 4481, 4410, 4577, 4489, 4462,
      4509, 4444, 4588, 4397, 4483, 4404, 4484, 4593, 4560, 4512, 4440, 4448,
      4576, 4454, 4399, 4597, 4455, 4523, 4573, 5483, 4589, 4453, 4392, 4391,
      4427, 4459, 4578, 4524, 4398, 4461, 4517, 4486, 4552, 4585, 4592,
    ],
    __typename: "WeatherStation",
  },
  {
    id: 8,
    name: "Kristiinankaupunki, majakka",
    influxName: "Kristiinankaupunki_Majakka",
    coordinates: [62.2, 21.17],
    areas: [2781],
    __typename: "WeatherStation",
  },
  {
    id: 13,
    name: "Pori, lentoasema",
    influxName: "Pori_lentoasema",
    coordinates: [61.46, 21.81],
    areas: [],
    __typename: "WeatherStation",
  },
  {
    id: 14,
    name: "Pori, rautatieasema",
    influxName: "Pori_rautatieasema",
    coordinates: [61.48, 21.78],
    areas: [
      2920, 3054, 3023, 3028, 3008, 2938, 3038, 2993, 2967, 2839, 2946, 3011,
      2962, 2988, 2933, 3036, 2840, 2924, 3032, 3029, 3068, 3044, 2964, 3033,
      2951, 2929, 2970, 2986, 2931, 2859, 2997, 2973, 2974, 3007, 2862, 3000,
      3014, 2950, 3017, 2996, 2976, 3021, 2943, 2952, 2940, 3006, 2937, 2947,
      3034, 3013, 3015, 2941, 2994, 3019, 2971, 3069, 2928, 2987, 2954, 3051,
      2999, 2942, 3042, 2939, 2944, 3026, 3003, 3041, 3031, 2998, 3025, 2979,
      2925, 2985, 3016, 2841, 3053, 3022, 3020, 2975, 3052, 3027, 2992, 2930,
      2968, 2945, 2949, 2936, 3043, 2922, 2935, 2969, 2984, 2995, 2959, 2963,
      2926, 2978, 2981, 2958, 3035, 3009, 2965, 2861, 2989, 2972, 2982, 2956,
      2953, 3039, 3004, 2980, 2960, 2927, 3018, 2991, 3030, 2923, 3024, 2961,
      3067, 2932, 3037, 2966, 2948, 2990, 3040, 2983, 3010, 3002, 3012, 2955,
      3005, 2977, 2957, 3120, 3001, 2934, 3065, 4366, 3129, 4361, 3056, 3099,
      4390, 3082, 3075, 3119, 3108, 4388, 3113, 3127, 4363, 3089, 4380, 3110,
      3073, 3079, 3070, 3109, 3066, 3094, 3083, 3064, 3060, 3090, 3058, 3104,
      4360, 3112, 4389, 3124, 3122, 4386, 3101, 4372, 4368, 3130, 3117, 3059,
      3085, 3074, 3055, 3057, 3095, 3105, 3093, 3081, 3080, 4371, 4370, 4369,
      3091, 3092, 4381, 3072, 4377, 3131, 3107, 3116, 4375, 4385, 3100, 3128,
      3050, 3061, 4382, 3078, 3062, 4197, 3087, 3047, 3076, 4387, 3135, 3111,
      4378, 3096, 3103, 3077, 3045, 3049, 4364, 4384, 3063, 4194, 3071, 4376,
      4379, 3106, 4365, 3098, 4373, 3126, 3125, 4393, 4383, 3086, 3115, 3048,
      4195, 3114, 3046, 3132, 3123, 3121, 3102, 3088, 4196, 4362, 3097, 3118,
      3084, 4367,
    ],
    __typename: "WeatherStation",
  },
  {
    id: 15,
    name: "Pori, Tahkoluoto",
    influxName: "Pori_Tahkoluoto_satama",
    coordinates: [61.63, 21.38],
    areas: [
      2847, 2824, 2819, 2842, 2815, 2844, 2821, 2921, 2919, 2833, 2817, 2831,
      2834, 2836, 2855, 2856, 2853, 2813, 2810, 2830, 2814, 2854, 2825, 2827,
      2826, 2845, 2811, 2828, 2848, 2816, 2818, 2835, 2838, 2832,
    ],
    __typename: "WeatherStation",
  },
  {
    id: 17,
    name: "Rauma, Kylmäpihlaja",
    influxName: "Rauma_Kylmäpihlaja",
    coordinates: [61.14, 21.3],
    areas: [4201, 4209, 4193, 4203, 4200],
    __typename: "WeatherStation",
  },
  {
    id: 18,
    name: "Rauma, Pyynpää",
    influxName: "Rauma_Pyynpää",
    coordinates: [61.14, 21.52],
    areas: [
      4263, 4530, 4261, 4279, 4258, 4222, 4282, 4546, 4532, 4244, 4572, 4277,
      4298, 4210, 4541, 4238, 4542, 4218, 4266, 4299, 4239, 4286, 4237, 4426,
      4285, 4276, 4220, 4254, 4280, 4226, 4213, 4206, 4537, 4199, 4240, 4534,
      4287, 4288, 4269, 4248, 4281, 4421, 4415, 4428, 4253, 4252, 4543, 4230,
      4215, 4422, 4310, 4416, 4272, 4228, 4414, 4207, 4249, 4301, 4420, 4545,
      4208, 4260, 4233, 4424, 4231, 4255, 4211, 4536, 4241, 4217, 4265, 4259,
      4225, 4430, 4223, 4539, 4198, 4540, 4205, 4295, 4268, 4283, 4267, 4294,
      4245, 4297, 4304, 4247, 4305, 4309, 4535, 4307, 4302, 4234, 4270, 4538,
      4418, 4275, 4221, 4374, 4232, 4278, 4204, 4236, 4227, 4533, 4273, 4417,
      4274, 4271, 4235, 4423, 4262, 4431, 4432, 4548, 4251, 4429, 4264, 4306,
      4531, 4434, 4284, 4224, 4242, 4229, 4243, 4214, 4300, 4257, 4256, 4216,
      4433, 4212, 4296, 4413, 4250, 4246, 4303, 4202, 4219, 4419, 4425,
    ],
    __typename: "WeatherStation",
  },
];

const WeatherStationMarkers = ({activeSite, setActiveSite}) => {
  const ActiveMarker = ({site}) => {
    return (
      <Marker
        position={[site?.coordinates[0], site?.coordinates[1]]}
        icon={weatherStationActiveIcon}
        eventHandlers={{click: () => setActiveSite(null)}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.name}
        </Tooltip>
      </Marker>
    );
  };

  const PassiveMarker = ({site, setActiveSite}) => {
    return (
      <Marker
        position={[site?.coordinates[0], site?.coordinates[1]]}
        icon={weatherStationIcon}
        eventHandlers={{click: () => setActiveSite(site)}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.name}
        </Tooltip>
      </Marker>
    );
  };

  const listMarkers = sites?.map(site => {
    return activeSite && activeSite?.id === site?.id ? (
      <ActiveMarker key={site?.id} site={site} setActiveSite={setActiveSite} />
    ) : (
      <PassiveMarker key={site.id} site={site} setActiveSite={setActiveSite} />
    );
  });

  return <>{sites ? listMarkers : null}</>;
};

export default WeatherStationMarkers;
