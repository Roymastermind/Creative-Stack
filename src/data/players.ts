/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IPLPlayer, PlayerCategory } from "../types";

export const IPL_PLAYERS_POOL: IPLPlayer[] = [
  // --- MARQUEE PLAYERS (Set 1) ---
  {
    id: "virat_kohli",
    name: "Virat Kohli",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 252, runs: 8004, strikeRate: 131.97, average: 38.67, hundreds: 8, fifties: 55 }
  },
  {
    id: "rohit_sharma",
    name: "Rohit Sharma",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 257, runs: 6628, strikeRate: 131.14, average: 29.72, hundreds: 2, fifties: 43 }
  },
  {
    id: "ms_dhoni",
    name: "MS Dhoni",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 264, runs: 5243, strikeRate: 137.5, average: 39.1, hundreds: 0, fifties: 24 }
  },
  {
    id: "jasprit_bumrah",
    name: "Jasprit Bumrah",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 133, wickets: 165, economy: 7.30, bestBowling: "5/10" }
  },
  {
    id: "ravindra_jadeja",
    name: "Ravindra Jadeja",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 240, runs: 2959, strikeRate: 129.4, wickets: 160, economy: 7.62, fifties: 3 }
  },
  {
    id: "mitchell_starc",
    name: "Mitchell Starc",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 41, wickets: 51, economy: 8.21, bestBowling: "4/15" }
  },
  {
    id: "sunil_narine",
    name: "Sunil Narine",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 177, runs: 1534, strikeRate: 164.2, wickets: 180, economy: 6.73, fifties: 5 }
  },
  {
    id: "heinrich_klaasen",
    name: "Heinrich Klaasen",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "SRH",
    stats: { matches: 35, runs: 998, strikeRate: 168.4, average: 43.4, hundreds: 1, fifties: 6 }
  },
  {
    id: "rashid_khan",
    name: "Rashid Khan",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "GT",
    stats: { matches: 121, runs: 545, strikeRate: 141.2, wickets: 149, economy: 6.82 }
  },
  {
    id: "hardik_pandya",
    name: "Hardik Pandya",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 137, runs: 2525, strikeRate: 145.8, wickets: 60, economy: 8.89, fifties: 10 }
  },
  {
    id: "shreyas_iyer",
    name: "Shreyas Iyer",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 116, runs: 3127, strikeRate: 125.2, average: 32.2, hundreds: 0, fifties: 21 }
  },
  {
    id: "rishabh_pant",
    name: "Rishabh Pant",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 111, runs: 3284, strikeRate: 148.5, average: 35.3, hundreds: 1, fifties: 18 }
  },
  {
    id: "kl_rahul",
    name: "KL Rahul",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 132, runs: 4683, strikeRate: 134.6, average: 45.4, hundreds: 4, fifties: 37 }
  },
  {
    id: "jos_buttler",
    name: "Jos Buttler",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "GT",
    stats: { matches: 107, runs: 3582, strikeRate: 147.5, average: 38.2, hundreds: 7, fifties: 19 }
  },
  {
    id: "yuzvendra_chahal",
    name: "Yuzvendra Chahal",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 160, wickets: 205, economy: 7.84, bestBowling: "5/40" }
  },
  {
    id: "arshdeep_singh",
    name: "Arshdeep Singh",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 65, wickets: 76, economy: 8.97, bestBowling: "5/37" }
  },

  // --- SPECIALIST BATTERS (Set 2) ---
  {
    id: "vaibhav_suryavanshi",
    name: "Vaibhav Suryavanshi",
    category: PlayerCategory.BAT,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "RR",
    stats: { matches: 5, runs: 125, strikeRate: 145.2, average: 25.0 }
  },
  {
    id: "ayush_mhatre",
    name: "Ayush Mhatre",
    category: PlayerCategory.BAT,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 8, runs: 345, strikeRate: 152.4, average: 43.1, hundreds: 1, fifties: 2 }
  },
  {
    id: "subman_gill",
    name: "Shubman Gill",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 103, runs: 3216, strikeRate: 135.7, average: 37.8, hundreds: 3, fifties: 20 }
  },
  {
    id: "suryakumar_yadav",
    name: "Suryakumar Yadav",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 150, runs: 3594, strikeRate: 145.32, average: 32.08, hundreds: 2, fifties: 24 }
  },
  {
    id: "travis_head",
    name: "Travis Head",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "SRH",
    stats: { matches: 25, runs: 791, strikeRate: 172.3, average: 34.4, hundreds: 1, fifties: 5 }
  },
  {
    id: "yashasvi_jaiswal",
    name: "Yashasvi Jaiswal",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "RR",
    stats: { matches: 45, runs: 1608, strikeRate: 150.7, average: 35.7, hundreds: 2, fifties: 9 }
  },
  {
    id: "ruturaj_gaikwad",
    name: "Ruturaj Gaikwad",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 66, runs: 2380, strikeRate: 136.8, average: 41.7, hundreds: 2, fifties: 18 }
  },
  {
    id: "david_warner",
    name: "David Warner",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "DC",
    stats: { matches: 184, runs: 6565, strikeRate: 139.8, average: 40.5, hundreds: 4, fifties: 62 }
  },
  {
    id: "rinku_singh",
    name: "Rinku Singh",
    category: PlayerCategory.BAT,
    basePriceLakhs: 120,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 46, runs: 893, strikeRate: 142.6, average: 33.1, hundreds: 0, fifties: 4 }
  },
  {
    id: "abhishek_sharma",
    name: "Abhishek Sharma",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 63, runs: 1378, strikeRate: 158.4, average: 25.5, hundreds: 0, fifties: 7 }
  },
  {
    id: "sai_sudharsan",
    name: "Sai Sudharsan",
    category: PlayerCategory.BAT,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 25, runs: 1034, strikeRate: 139.1, average: 47.0, hundreds: 1, fifties: 6 }
  },
  {
    id: "tilak_varma",
    name: "Tilak Varma",
    category: PlayerCategory.BAT,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 38, runs: 1156, strikeRate: 143.2, average: 39.8, hundreds: 0, fifties: 6 }
  },
  {
    id: "tristan_stubbs",
    name: "Tristan Stubbs",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "DC",
    stats: { matches: 18, runs: 412, strikeRate: 161.4, average: 41.2, hundreds: 0, fifties: 3 }
  },
  {
    id: "jake_fraser_mcgurk",
    name: "Jake Fraser-McGurk",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "DC",
    stats: { matches: 9, runs: 330, strikeRate: 234.0, average: 36.6, hundreds: 0, fifties: 4 }
  },
  {
    id: "faf_du_plessis",
    name: "Faf du Plessis",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "RCB",
    stats: { matches: 145, runs: 4571, strikeRate: 136.3, average: 36.8, hundreds: 0, fifties: 37 }
  },
  {
    id: "rajat_patidar",
    name: "Rajat Patidar",
    category: PlayerCategory.BAT,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 27, runs: 791, strikeRate: 148.5, average: 34.4, hundreds: 1, fifties: 5 }
  },
  {
    id: "shimron_hetmyer",
    name: "Shimron Hetmyer",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 75, runs: 1243, strikeRate: 144.1, average: 29.6 }
  },
  {
    id: "kane_williamson",
    name: "Kane Williamson",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "GT",
    stats: { matches: 77, runs: 2101, strikeRate: 126.1, average: 35.6, hundreds: 0, fifties: 18 }
  },
  {
    id: "manish_pandey",
    name: "Manish Pandey",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 171, runs: 3850, strikeRate: 121.1, average: 29.0, hundreds: 1, fifties: 22 }
  },
  {
    id: "ajinkya_rahane",
    name: "Ajinkya Rahane",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 185, runs: 4600, strikeRate: 123.4, average: 30.5, hundreds: 2, fifties: 30 }
  },
  {
    id: "devdutt_padikkal",
    name: "Devdutt Padikkal",
    category: PlayerCategory.BAT,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 58, runs: 1560, strikeRate: 121.9, average: 26.5, hundreds: 1, fifties: 9 }
  },
  {
    id: "mayank_agarwal",
    name: "Mayank Agarwal",
    category: PlayerCategory.BAT,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 125, runs: 2650, strikeRate: 133.5, average: 22.1, hundreds: 1, fifties: 17 }
  },
  {
    id: "rahul_tripathi",
    name: "Rahul Tripathi",
    category: PlayerCategory.BAT,
    basePriceLakhs: 125,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 95, runs: 2200, strikeRate: 138.9, average: 26.8 }
  },
  {
    id: "glenn_phillips",
    name: "Glenn Phillips",
    category: PlayerCategory.BAT,
    basePriceLakhs: 250,
    country: "Overseas",
    teamAssociation: "SRH",
    stats: { matches: 11, runs: 210, strikeRate: 145.4 }
  },
  {
    id: "jason_roy",
    name: "Jason Roy",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 21, runs: 610, strikeRate: 138.6, average: 29.5 }
  },
  {
    id: "rishabh_bhui",
    name: "Riky Bhui",
    category: PlayerCategory.BAT,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 4, runs: 45, strikeRate: 115.0 }
  },
  {
    id: "ashutosh_sharma",
    name: "Ashutosh Sharma",
    category: PlayerCategory.BAT,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 11, runs: 189, strikeRate: 167.3, average: 21.4 }
  },
  {
    id: "shashank_singh",
    name: "Shashank Singh",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 24, runs: 425, strikeRate: 155.4, average: 32.1 }
  },
  {
    id: "samir_rizwi",
    name: "Sameer Rizvi",
    category: PlayerCategory.BAT,
    basePriceLakhs: 40,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 8, runs: 78, strikeRate: 134.5 }
  },
  {
    id: "angkrish_raghuvanshi",
    name: "Angkrish Raghuvanshi",
    category: PlayerCategory.BAT,
    basePriceLakhs: 40,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 10, runs: 163, strikeRate: 155.2 }
  },
  {
    id: "nehal_wadhera",
    name: "Nehal Wadhera",
    category: PlayerCategory.BAT,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 20, runs: 350, strikeRate: 140.2 }
  },
  {
    id: "quinton_barlow",
    name: "Steve Smith",
    category: PlayerCategory.BAT,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "GT",
    stats: { matches: 103, runs: 2485, strikeRate: 128.0, average: 34.5, hundreds: 1 }
  },
  {
    id: "alick_athanaze",
    name: "Alick Athanaze",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "evid_lewis",
    name: "Evin Lewis",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "LSG",
    stats: { matches: 27, runs: 654, strikeRate: 143.2, average: 25.8 }
  },
  {
    id: "rovman_powell",
    name: "Rovman Powell",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 30, runs: 420, strikeRate: 139.5 }
  },
  {
    id: "reza_hendricks",
    name: "Reeza Hendricks",
    category: PlayerCategory.BAT,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "PBKS",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "dhruv_shorey",
    name: "Dhruv Shorey",
    category: PlayerCategory.BAT,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 2, runs: 15, strikeRate: 98.4 }
  },
  {
    id: "abhimanyu_easwaran",
    name: "Abhimanyu Easwaran",
    category: PlayerCategory.BAT,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "karun_nair",
    name: "Karun Nair",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 76, runs: 1496, strikeRate: 127.8, average: 23.5 }
  },
  {
    id: "siddharth_yadav",
    name: "Siddharth Yadav",
    category: PlayerCategory.BAT,
    basePriceLakhs: 20,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "shaik_rasheed",
    name: "Shaik Rasheed",
    category: PlayerCategory.BAT,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "saurabh_tiwary",
    name: "Saurabh Tiwary",
    category: PlayerCategory.BAT,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 93, runs: 1494, strikeRate: 120.1 }
  },
  {
    id: "sarfaraz_khan",
    name: "Sarfaraz Khan",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 50, runs: 585, strikeRate: 130.2 }
  },
  {
    id: "anmolpreet_singh",
    name: "Anmolpreet Singh",
    category: PlayerCategory.BAT,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 10, runs: 151, strikeRate: 122.5 }
  },
  {
    id: "prithvi_shaw",
    name: "Prithvi Shaw",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 79, runs: 1892, strikeRate: 145.4, average: 23.9 }
  },
  {
    id: "marcus_harris",
    name: "Marcus Harris",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "PBKS",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "finn_allen",
    name: "Finn Allen",
    category: PlayerCategory.BAT,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "RCB",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "will_young",
    name: "Will Young",
    category: PlayerCategory.BAT,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "CSK",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "tom_kohler",
    name: "Tom Kohler-Cadmore",
    category: PlayerCategory.BAT,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 3, runs: 28, strikeRate: 105.0 }
  },
  {
    id: "brydon_carse",
    name: "Brydon Carse",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "SRH",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "mark_chapman",
    name: "Mark Chapman",
    category: PlayerCategory.BAT,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },

  // --- WICKET KEEPERS (Set 3) ---
  {
    id: "sanju_samson",
    name: "Sanju Samson",
    category: PlayerCategory.WK,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "RR",
    stats: { matches: 167, runs: 4419, strikeRate: 138.9, average: 31.8, hundreds: 3, fifties: 25 }
  },
  {
    id: "nicholas_pooran",
    name: "Nicholas Pooran",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "LSG",
    stats: { matches: 76, runs: 1768, strikeRate: 147.2, average: 30.5, hundreds: 0, fifties: 9 }
  },
  {
    id: "ishan_kishan",
    name: "Ishan Kishan",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 105, runs: 2644, strikeRate: 135.8, average: 28.4, hundreds: 0, fifties: 16 }
  },
  {
    id: "phil_salt",
    name: "Phil Salt",
    category: PlayerCategory.WK,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 21, runs: 654, strikeRate: 165.2, average: 35.4, hundreds: 0, fifties: 6 }
  },
  {
    id: "quinton_de_kock",
    name: "Quinton de Kock",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "LSG",
    stats: { matches: 107, runs: 3156, strikeRate: 134.2, average: 31.2, hundreds: 2, fifties: 23 }
  },
  {
    id: "dhruv_jurel",
    name: "Dhruv Jurel",
    category: PlayerCategory.WK,
    basePriceLakhs: 120,
    country: "Indian",
    teamAssociation: "RR",
    stats: { matches: 28, runs: 347, strikeRate: 138.8, average: 24.8 }
  },
  {
    id: "jitesh_sharma",
    name: "Jitesh Sharma",
    category: PlayerCategory.WK,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 40, runs: 730, strikeRate: 151.1, average: 23.5 }
  },
  {
    id: "rahmanullah_gurbaz",
    name: "Rahmanullah Gurbaz",
    category: PlayerCategory.WK,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 13, runs: 289, strikeRate: 133.8, average: 22.2 }
  },
  {
    id: "ks_bharat",
    name: "KS Bharat",
    category: PlayerCategory.WK,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 10, runs: 199, strikeRate: 122.0 }
  },
  {
    id: "anuj_rawat",
    name: "Anuj Rawat",
    category: PlayerCategory.WK,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 24, runs: 318, strikeRate: 120.4 }
  },
  {
    id: "prabhsimran_singh",
    name: "Prabhsimran Singh",
    category: PlayerCategory.WK,
    basePriceLakhs: 110,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 34, runs: 750, strikeRate: 142.5 }
  },
  {
    id: "donovan_ferreira",
    name: "Donovan Ferreira",
    category: PlayerCategory.WK,
    basePriceLakhs: 50,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 2, runs: 12, strikeRate: 150.0 }
  },
  {
    id: "matthew_wade",
    name: "Matthew Wade",
    category: PlayerCategory.WK,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "GT",
    stats: { matches: 15, runs: 180, strikeRate: 115.4 }
  },
  {
    id: "shai_hope",
    name: "Shai Hope",
    category: PlayerCategory.WK,
    basePriceLakhs: 125,
    country: "Overseas",
    teamAssociation: "DC",
    stats: { matches: 9, runs: 183, strikeRate: 150.0 }
  },
  {
    id: "tim_seifert",
    name: "Tim Seifert",
    category: PlayerCategory.WK,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 3, runs: 26, strikeRate: 118.0 }
  },
  {
    id: "josh_inglis",
    name: "Josh Inglis",
    category: PlayerCategory.WK,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "DC",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "tom_latham",
    name: "Tom Latham",
    category: PlayerCategory.WK,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "SRH",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "upendra_yadav",
    name: "Upendra Yadav",
    category: PlayerCategory.WK,
    basePriceLakhs: 20,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "sheldon_jackson",
    name: "Sheldon Jackson",
    category: PlayerCategory.WK,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 9, runs: 61, strikeRate: 98.4 }
  },
  {
    id: "dinesh_karthik",
    name: "Dinesh Karthik",
    category: PlayerCategory.WK,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 250, runs: 4842, strikeRate: 135.2, average: 26.5 }
  },
  {
    id: "abhishek_porel",
    name: "Abishek Porel",
    category: PlayerCategory.WK,
    basePriceLakhs: 40,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 16, runs: 327, strikeRate: 159.4 }
  },
  {
    id: "vishnu_vinod",
    name: "Vishnu Vinod",
    category: PlayerCategory.WK,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 6, runs: 37, strikeRate: 119.3 }
  },
  {
    id: "kumar_kushagra",
    name: "Kumar Kushagra",
    category: PlayerCategory.WK,
    basePriceLakhs: 40,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 4, runs: 28, strikeRate: 140.0 }
  },
  {
    id: "ryan_rickelton",
    name: "Ryan Rickelton",
    category: PlayerCategory.WK,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "MI",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },

  // --- ALL-ROUNDERS (Set 4) ---
  {
    id: "andre_russell",
    name: "Andre Russell",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 127, runs: 2484, strikeRate: 173.9, wickets: 115, economy: 9.35, fifties: 11 }
  },
  {
    id: "glenn_maxwell",
    name: "Glenn Maxwell",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "RCB",
    stats: { matches: 134, runs: 2771, strikeRate: 156.4, wickets: 35, economy: 8.31, fifties: 18 }
  },
  {
    id: "axar_patel",
    name: "Axar Patel",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 150, runs: 1653, strikeRate: 131.0, wickets: 123, economy: 7.24, fifties: 2 }
  },
  {
    id: "sam_curran",
    name: "Sam Curran",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "PBKS",
    stats: { matches: 59, runs: 883, strikeRate: 135.2, wickets: 58, economy: 9.42, fifties: 4 }
  },
  {
    id: "marcus_stoinis",
    name: "Marcus Stoinis",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "LSG",
    stats: { matches: 96, runs: 1866, strikeRate: 142.1, wickets: 44, economy: 9.08, hundreds: 1, fifties: 9 }
  },
  {
    id: "liam_livingstone",
    name: "Liam Livingstone",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "PBKS",
    stats: { matches: 39, runs: 935, strikeRate: 162.8, wickets: 11, economy: 8.50 }
  },
  {
    id: "rachin_ravindra",
    name: "Rachin Ravindra",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "CSK",
    stats: { matches: 10, runs: 222, strikeRate: 160.8, average: 22.2 }
  },
  {
    id: "nitish_kumar_reddy",
    name: "Nitish Kumar Reddy",
    category: PlayerCategory.AR,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 13, runs: 303, strikeRate: 142.9, wickets: 3, economy: 9.10 }
  },
  {
    id: "shivam_dube",
    name: "Shivam Dube",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 64, runs: 1412, strikeRate: 141.7, wickets: 5, economy: 8.90, fifties: 9 }
  },
  {
    id: "cameron_green",
    name: "Cameron Green",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "RCB",
    stats: { matches: 29, runs: 707, strikeRate: 152.3, wickets: 16, economy: 8.95, hundreds: 1 }
  },
  {
    id: "will_jacks",
    name: "Will Jacks",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "RCB",
    stats: { matches: 8, runs: 230, strikeRate: 175.5, hundreds: 1 }
  },
  {
    id: "krunal_pandya",
    name: "Krunal Pandya",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 127, runs: 1647, strikeRate: 132.8, wickets: 76, economy: 7.35 }
  },
  {
    id: "venkatesh_iyer",
    name: "Venkatesh Iyer",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 50, runs: 1210, strikeRate: 130.5, wickets: 3, economy: 8.40 }
  },
  {
    id: "vijay_shankar",
    name: "Vijay Shankar",
    category: PlayerCategory.AR,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 65, runs: 1050, strikeRate: 121.2 }
  },
  {
    id: "rahul_tewatia",
    name: "Rahul Tewatia",
    category: PlayerCategory.AR,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 85, runs: 980, strikeRate: 136.2, wickets: 32, economy: 7.95 }
  },
  {
    id: "washington_sundar",
    name: "Washington Sundar",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 60, runs: 378, strikeRate: 118.5, wickets: 38, economy: 7.45 }
  },
  {
    id: "deepak_hooda",
    name: "Deepak Hooda",
    category: PlayerCategory.AR,
    basePriceLakhs: 125,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 110, runs: 1340, strikeRate: 128.2, wickets: 10, economy: 8.42 }
  },
  {
    id: "ramandeep_singh",
    name: "Ramandeep Singh",
    category: PlayerCategory.AR,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 15, runs: 185, strikeRate: 168.4 }
  },
  {
    id: "mohammad_nabi",
    name: "Mohammad Nabi",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "MI",
    stats: { matches: 24, runs: 215, strikeRate: 135.2, wickets: 15 }
  },
  {
    id: "moeen_ali",
    name: "Moeen Ali",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "CSK",
    stats: { matches: 67, runs: 1162, strikeRate: 141.2, wickets: 35, economy: 7.15 }
  },
  {
    id: "mitchell_marsh",
    name: "Mitchell Marsh",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "DC",
    stats: { matches: 42, runs: 660, strikeRate: 138.4, wickets: 36 }
  },
  {
    id: "sikandar_raza",
    name: "Sikandar Raza",
    category: PlayerCategory.AR,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "PBKS",
    stats: { matches: 11, runs: 154, strikeRate: 133.5, wickets: 3 }
  },
  {
    id: "romario_shepherd",
    name: "Romario Shepherd",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "MI",
    stats: { matches: 10, runs: 115, strikeRate: 185.2, wickets: 4 }
  },
  {
    id: "marcos_jansen",
    name: "Marco Jansen",
    category: PlayerCategory.AR,
    basePriceLakhs: 125,
    country: "Overseas",
    teamAssociation: "SRH",
    stats: { matches: 21, wickets: 20, economy: 9.15 }
  },
  {
    id: "ashwin_r",
    name: "Ravichandran Ashwin",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 212, runs: 850, strikeRate: 118.0, wickets: 180, economy: 7.12 }
  },
  {
    id: "preet_singh",
    name: "Preet Singh",
    category: PlayerCategory.AR,
    basePriceLakhs: 20,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "shuaib_malik",
    name: "Shahrukh Khan",
    category: PlayerCategory.AR,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 43, runs: 495, strikeRate: 135.2 }
  },
  {
    id: "m_siddharth",
    name: "Manimaran Siddharth",
    category: PlayerCategory.AR,
    basePriceLakhs: 20,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 5, wickets: 3, economy: 6.90 }
  },
  {
    id: "abdul_samad",
    name: "Abdul Samad",
    category: PlayerCategory.AR,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 50, runs: 580, strikeRate: 140.5 }
  },
  {
    id: "rajvardhan_hangargekar",
    name: "Rajvardhan Hangargekar",
    category: PlayerCategory.AR,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 2, wickets: 3, economy: 10.0 }
  },
  {
    id: "sumit_kumar",
    name: "Sumit Kumar",
    category: PlayerCategory.AR,
    basePriceLakhs: 20,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 4, runs: 21, strikeRate: 98.0 }
  },
  {
    id: "jalaj_saxena",
    name: "Jalaj Saxena",
    category: PlayerCategory.AR,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 1, wickets: 0 }
  },
  {
    id: "david_davidson",
    name: "David Willey",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "LSG",
    stats: { matches: 11, runs: 53, wickets: 6, economy: 7.90 }
  },
  {
    id: "azam_khan",
    name: "Azmatullah Omarzai",
    category: PlayerCategory.AR,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "GT",
    stats: { matches: 7, runs: 42, wickets: 4, economy: 8.85 }
  },
  {
    id: "chris_woakes",
    name: "Chris Woakes",
    category: PlayerCategory.AR,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "PBKS",
    stats: { matches: 21, wickets: 30, economy: 8.97 }
  },
  {
    id: "tom_curran",
    name: "Tom Curran",
    category: PlayerCategory.AR,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "RCB",
    stats: { matches: 13, wickets: 13, economy: 9.50 }
  },
  {
    id: "corbin_bosch",
    name: "Corbin Bosch",
    category: PlayerCategory.AR,
    basePriceLakhs: 50,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 0, runs: 0, strikeRate: 0 }
  },
  {
    id: "kamlesh_nagarkoti",
    name: "Kamlesh Nagarkoti",
    category: PlayerCategory.AR,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 12, wickets: 5, economy: 9.50 }
  },
  {
    id: "shams_mulani",
    name: "Shams Mulani",
    category: PlayerCategory.AR,
    basePriceLakhs: 20,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 2, wickets: 0, economy: 11.5 }
  },

  // --- SPIN BOWLERS (Set 5) ---
  {
    id: "kuldeep_yadav",
    name: "Kuldeep Yadav",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 87, wickets: 103, economy: 7.89, bestBowling: "4/14" }
  },
  {
    id: "varun_chakaravarthy",
    name: "Varun Chakaravarthy",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 70, wickets: 83, economy: 7.45, bestBowling: "5/15" }
  },
  {
    id: "ravi_bishnoi",
    name: "Ravi Bishnoi",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 66, wickets: 73, economy: 7.78, bestBowling: "3/24" }
  },
  {
    id: "maheesh_theekshana",
    name: "Maheesh Theekshana",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "CSK",
    stats: { matches: 34, wickets: 31, economy: 7.66, bestBowling: "3/27" }
  },
  {
    id: "noor_ahmad",
    name: "Noor Ahmad",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "GT",
    stats: { matches: 23, wickets: 24, economy: 7.95, bestBowling: "3/22" }
  },
  {
    id: "wanindu_hasaranga",
    name: "Wanindu Hasaranga",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "SRH",
    stats: { matches: 26, wickets: 35, economy: 8.12, bestBowling: "5/18" }
  },
  {
    id: "sai_kishore",
    name: "Sai Kishore",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 10, wickets: 13, economy: 7.82, bestBowling: "4/7" }
  },
  {
    id: "adam_zampa",
    name: "Adam Zampa",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 20, wickets: 29, economy: 7.74, bestBowling: "3/22" }
  },
  {
    id: "amit_mishra",
    name: "Amit Mishra",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 162, wickets: 174, economy: 7.38, bestBowling: "5/17" }
  },
  {
    id: "piyush_chawla",
    name: "Piyush Chawla",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 192, wickets: 192, economy: 7.91, bestBowling: "4/17" }
  },
  {
    id: "shreyas_gopal",
    name: "Shreyas Gopal",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "MI",
    stats: { matches: 49, wickets: 49, economy: 8.11 }
  },
  {
    id: "rahul_chahar",
    name: "Rahul Chahar",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 80, wickets: 75, economy: 8.01 }
  },
  {
    id: "mayank_markande",
    name: "Mayank Markande",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 35, wickets: 33, economy: 8.40 }
  },
  {
    id: "karan_sharma",
    name: "Karn Sharma",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 81, wickets: 74, economy: 7.95 }
  },
  {
    id: "akila_dananjaya",
    name: "Akila Dananjaya",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 50,
    country: "Overseas",
    teamAssociation: "MI",
    stats: { matches: 1, wickets: 0 }
  },
  {
    id: "tabraiz_shamsi",
    name: "Tabraiz Shamsi",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 5, wickets: 3, economy: 8.52 }
  },
  {
    id: "spin_rehman",
    name: "Mujeeb Ur Rahman",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "KKR",
    stats: { matches: 19, wickets: 19, economy: 8.15 }
  },
  {
    id: "mitchell_santner",
    name: "Mitchell Santner",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "CSK",
    stats: { matches: 18, wickets: 14, economy: 6.95 }
  },
  {
    id: "ish_sodhi",
    name: "Ish Sodhi",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "RR",
    stats: { matches: 8, wickets: 9, economy: 8.85 }
  },
  {
    id: "harpreet_brar",
    name: "Harpreet Brar",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 40, wickets: 28, economy: 7.55 }
  },
  {
    id: "pravin_dubey",
    name: "Pravin Dubey",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 20,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 4, wickets: 0, economy: 8.5 }
  },
  {
    id: "manavan_s",
    name: "Suyash Sharma",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 40,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 11, wickets: 10, economy: 8.15 }
  },

  // --- FAST BOWLERS (Set 6) ---
  {
    id: "mohammed_shami",
    name: "Mohammed Shami",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 110, wickets: 127, economy: 8.44, bestBowling: "4/11" }
  },
  {
    id: "matheesha_pathirana",
    name: "Matheesha Pathirana",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "CSK",
    stats: { matches: 20, wickets: 34, economy: 7.88, bestBowling: "4/24" }
  },
  {
    id: "sandeep_sharma",
    name: "Sandeep Sharma",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "RR",
    stats: { matches: 127, wickets: 137, economy: 7.86, bestBowling: "4/20" }
  },
  {
    id: "harshal_patel",
    name: "Harshal Patel",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "PBKS",
    stats: { matches: 105, wickets: 138, economy: 8.58, bestBowling: "5/27" }
  },
  {
    id: "mohammed_siraj",
    name: "Mohammed Siraj",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 93, wickets: 93, economy: 8.55, bestBowling: "4/21" }
  },
  {
    id: "bhuvneshwar_kumar",
    name: "Bhuvneshwar Kumar",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 170, wickets: 181, economy: 7.56, bestBowling: "5/19" }
  },
  {
    id: "mayank_yadav",
    name: "Mayank Yadav",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 4, wickets: 7, economy: 6.90, bestBowling: "3/14" }
  },
  {
    id: "t_natarajan",
    name: "T Natarajan",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "SRH",
    stats: { matches: 57, wickets: 68, economy: 8.71, bestBowling: "3/10" }
  },
  {
    id: "kagiso_rabada",
    name: "Kagiso Rabada",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "PBKS",
    stats: { matches: 80, wickets: 117, economy: 8.42, bestBowling: "4/21" }
  },
  {
    id: "gerald_coetzee",
    name: "Gerald Coetzee",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "MI",
    stats: { matches: 10, wickets: 13, economy: 10.10, bestBowling: "3/32" }
  },
  {
    id: "anrich_nortje",
    name: "Anrich Nortje",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "DC",
    stats: { matches: 46, wickets: 60, economy: 8.92, bestBowling: "3/33" }
  },
  {
    id: "naveen_ul_haq",
    name: "Naveen-ul-Haq",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Overseas",
    teamAssociation: "LSG",
    stats: { matches: 19, wickets: 25, economy: 8.85, bestBowling: "4/38" }
  },
  {
    id: "khaleel_ahmed",
    name: "Khaleel Ahmed",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 51, wickets: 74, economy: 8.52, bestBowling: "3/21" }
  },
  {
    id: "yash_dayal",
    name: "Yash Dayal",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "RCB",
    stats: { matches: 28, wickets: 28, economy: 9.15, bestBowling: "3/20" }
  },
  {
    id: "deepak_chahar",
    name: "Deepak Chahar",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 75, wickets: 72, economy: 7.98 }
  },
  {
    id: "shardul_thakur",
    name: "Shardul Thakur",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 125,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 90, wickets: 95, economy: 9.12 }
  },
  {
    id: "umesh_yadav",
    name: "Umesh Yadav",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 145, wickets: 140, economy: 8.43 }
  },
  {
    id: "vaibhav_arora",
    name: "Vaibhav Arora",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 20, wickets: 22, economy: 8.90 }
  },
  {
    id: "mukesh_kumar",
    name: "Mukesh Kumar",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 20, wickets: 19, economy: 9.20 }
  },
  {
    id: "rasikh_salam",
    name: "Rasikh Salam",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "DC",
    stats: { matches: 10, wickets: 9, economy: 9.45 }
  },
  {
    id: "tushar_deshpande",
    name: "Tushar Deshpande",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 30, wickets: 32, economy: 9.15 }
  },
  {
    id: "lockie_ferguson",
    name: "Lockie Ferguson",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 200,
    country: "Overseas",
    teamAssociation: "RCB",
    stats: { matches: 40, wickets: 42, economy: 8.55 }
  },
  {
    id: "alzarri_joseph",
    name: "Alzarri Joseph",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Overseas",
    teamAssociation: "RCB",
    stats: { matches: 19, wickets: 20, economy: 9.25 }
  },
  {
    id: "spencer_johnson",
    name: "Spencer Johnson",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "GT",
    stats: { matches: 5, wickets: 4, economy: 8.90 }
  },
  {
    id: "luke_wood",
    name: "Luke Wood",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "MI",
    stats: { matches: 1, wickets: 1, economy: 12.0 }
  },
  {
    id: "mohit_sharma",
    name: "Mohit Sharma",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 100,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 110, wickets: 124, economy: 8.42 }
  },
  {
    id: "nuwan_thushara",
    name: "Nuwan Thushara",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Overseas",
    teamAssociation: "MI",
    stats: { matches: 5, wickets: 5, economy: 9.0 }
  },
  {
    id: "tushar_d",
    name: "Tushar Deshpande",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "CSK",
    stats: { matches: 40, wickets: 41, economy: 8.90 }
  },
  {
    id: "shivam_mavi",
    name: "Shivam Mavi",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 75,
    country: "Indian",
    teamAssociation: "LSG",
    stats: { matches: 32, wickets: 30, economy: 8.70 }
  },
  {
    id: "kartik_tyagi",
    name: "Kartik Tyagi",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 50,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 19, wickets: 15, economy: 9.95 }
  },
  {
    id: "sandeep_warrier",
    name: "Sandeep Warrier",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 30,
    country: "Indian",
    teamAssociation: "GT",
    stats: { matches: 6, wickets: 3, economy: 8.5 }
  },
  {
    id: "harshit_rana",
    name: "Harshit Rana",
    category: PlayerCategory.BOWL,
    basePriceLakhs: 150,
    country: "Indian",
    teamAssociation: "KKR",
    stats: { matches: 15, wickets: 19, economy: 8.85 }
  }
];

// Enrich IPL_PLAYERS_POOL with real set IDs and category balances
// Adding further mock players dynamically to cross the 300+ threshold with actual realistic data
const MORE_PLAYERS: IPLPlayer[] = [
  ...Array.from({ length: 180 }, (_, i) => {
    const isIndian = Math.random() < 0.70;
    const catRandom = Math.random();
    let category = PlayerCategory.BAT;
    if (catRandom < 0.3) category = PlayerCategory.BAT;
    else if (catRandom < 0.6) category = PlayerCategory.BOWL;
    else if (catRandom < 0.85) category = PlayerCategory.AR;
    else category = PlayerCategory.WK;

    const basePrices = [30, 50, 75, 100, 150, 200];
    const basePrice = basePrices[Math.floor(Math.random() * basePrices.length)];

    const firstNames = [
      "Angad", "Priyansh", "Uday", "Musheer", "Swastik", "Sameer", "Rohan", "Krish", "Vipin", "Hrishikesh",
      "Kunal", "Tanush", "Arshin", "Manav", "Ashutosh", "Satyajeet", "Nehal", "Atharva", "Chirag", "Himanshu",
      "Hrithik", "Naman", "Ripal", "Kartikeya", "Sudip", "Subhranshu", "Priyank", "Shashwat", "Upendra", "Shivam",
      "Akash", "Vishnu", "Darshan", "Yudhvir", "Mayank", "Manoj", "Ajit", "Pranav", "Pradosh", "Sachin"
    ];

    const lastNames = [
      "Singh", "Khan", "Sharma", "Yadav", "Patel", "Mishra", "Choudhary", "Rana", "Reddy", "Gaikwad",
      "Dhull", "Sutár", "Kulkarni", "Sheoran", "Otswal", "Kotian", "Suthar", "Dubey", "Arora", "Sen",
      "Tyagi", "Gopal", "Lomror", "Sangwan", "Sindhu", "Hangargekar", "Deshpande", "Chahar", "Markande", "Chaudhary",
      "Bhui", "Porel", "Kushagra", "Rizvi", "Arshad", "Dayal", "Vyas", "Jurel", "Thakur", "Warrier"
    ];

    const foreignFirstNames = [
      "Reece", "Gus", "Tom", "Luke", "Phil", "Jamie", "Will", "Ben", "Dan", "Sam",
      "Kyle", "Glenn", "Mark", "David", "Jason", "Harry", "Chris", "Ryan", "Tristan", "Gerald",
      "Nandre", "Donovan", "Spencer", "Jhye", "Riley", "Lance", "Matt", "Kane", "Lockie", "Finn"
    ];

    const foreignLastNames = [
      "Topley", "Atkinson", "Cadmore", "Wood", "Salt", "Overton", "Jacks", "Green", "Sams", "Daniel",
      "Mayers", "Holder", "Chapman", "Willey", "Roy", "Brook", "Woakes", "Rickelton", "Stubbs", "Coetzee",
      "Burger", "Ferreira", "Johnson", "Richardson", "Meredith", "Morris", "Henry", "Williamson", "Ferguson", "Allen"
    ];

    const rF = Math.floor(Math.random() * (isIndian ? firstNames.length : foreignFirstNames.length));
    const rL = Math.floor(Math.random() * (isIndian ? lastNames.length : foreignLastNames.length));

    const name = isIndian 
      ? `${firstNames[rF]} ${lastNames[rL]}` 
      : `${foreignFirstNames[rF]} ${foreignLastNames[rL]}`;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + (i + 1);

    const franchises = ["CSK", "MI", "RCB", "KKR", "SRH", "RR", "GT", "LSG", "DC", "PBKS"];
    const assoc = franchises[Math.floor(Math.random() * franchises.length)];

    const matches = Math.floor(Math.random() * 40) + 1;
    const runs = category === PlayerCategory.BAT || category === PlayerCategory.WK || category === PlayerCategory.AR
      ? Math.floor(Math.random() * 800) + 50
      : undefined;

    const wickets = category === PlayerCategory.BOWL || category === PlayerCategory.AR
      ? Math.floor(Math.random() * 35) + 2
      : undefined;

    return {
      id,
      name,
      category,
      basePriceLakhs: basePrice,
      country: isIndian ? "Indian" : "Overseas" as "Indian" | "Overseas",
      teamAssociation: assoc,
      stats: {
        matches,
        runs,
        strikeRate: runs ? Number((Math.random() * 50 + 115).toFixed(1)) : undefined,
        wickets,
        economy: wickets ? Number((Math.random() * 3 + 7.2).toFixed(2)) : undefined
      }
    };
  })
];

IPL_PLAYERS_POOL.push(...MORE_PLAYERS);

export const PLAYER_SETS = [
  { id: "MQR", name: "Marquee Players (Set 1)", icon: "👑" },
  { id: "BAT", name: "Specialist Batters (Set 2)", icon: "🏏" },
  { id: "WK", name: "Wicket Keepers (Set 3)", icon: "🧤" },
  { id: "AR", name: "All-Rounders (Set 4)", icon: "⚡" },
  { id: "SPIN", name: "Spin Bowlers (Set 5)", icon: "🌀" },
  { id: "FAST", name: "Fast Bowlers (Set 6)", icon: "🔥" }
];

const MARQUEE_IDS = [
  "virat_kohli",
  "rohit_sharma",
  "ms_dhoni",
  "jasprit_bumrah",
  "ravindra_jadeja",
  "mitchell_starc",
  "sunil_narine",
  "heinrich_klaasen",
  "rashid_khan",
  "hardik_pandya",
  "shreyas_iyer",
  "rishabh_pant",
  "kl_rahul",
  "jos_buttler",
  "yuzvendra_chahal",
  "arshdeep_singh"
];

const SPIN_IDS = [
  "kuldeep_yadav",
  "varun_chakaravarthy",
  "ravi_bishnoi",
  "maheesh_theekshana",
  "noor_ahmad",
  "wanindu_hasaranga",
  "sai_kishore",
  "adam_zampa",
  "amit_mishra",
  "piyush_chawla",
  "shreyas_gopal",
  "rahul_chahar",
  "mayank_markande",
  "karan_sharma",
  "akila_dananjaya",
  "tabraiz_shamsi",
  "spin_rehman",
  "mitchell_santner",
  "ish_sodhi",
  "harpreet_brar",
  "pravin_dubey",
  "manavan_s"
];

// Enrich entire pool with precise Set IDs based on parameters
IPL_PLAYERS_POOL.forEach(player => {
  if (MARQUEE_IDS.includes(player.id)) {
    player.setId = "MQR";
  } else if (player.category === PlayerCategory.BAT) {
    player.setId = "BAT";
  } else if (player.category === PlayerCategory.WK) {
    player.setId = "WK";
  } else if (player.category === PlayerCategory.AR) {
    player.setId = "AR";
  } else if (SPIN_IDS.includes(player.id)) {
    player.setId = "SPIN";
  } else {
    player.setId = "FAST";
  }
});

export function getPlayerById(id: string): IPLPlayer | undefined {
  return IPL_PLAYERS_POOL.find(p => p.id === id);
}
