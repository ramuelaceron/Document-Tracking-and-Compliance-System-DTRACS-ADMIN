
  import BCSTHS from "../assets/schoolsImages/BCST-HS.png";
  import BCSHSSAC from "../assets/schoolsImages/BCSHS-SAC.png";
  import BCSHSSTC from "../assets/schoolsImages/BCSHS-STC.png";
  import BCSHSTC from "../assets/schoolsImages/BCSHS-TC.png";
  import BCSHSWC from "../assets/schoolsImages/BCSHS-WC.png";
  import BES from "../assets/schoolsImages/BES.png";
  import BINHS from "../assets/schoolsImages/BINHS.png";
  import BSSAA from "../assets/schoolsImages/BSSAA.png";
  import CES from "../assets/schoolsImages/CES.png";
  import DPESM from "../assets/schoolsImages/DPES-Main.png";
  import DPNHS from "../assets/schoolsImages/DPNHS.png";
  import DPESW from "../assets/schoolsImages/DPES-West.png";
  import DJTMES from "../assets/schoolsImages/DJTMES.png";
  import DMZBMES from "../assets/schoolsImages/DMZBMES.png";
  import GES from "../assets/schoolsImages/GES.png";
  import JZGMNHS from "../assets/schoolsImages/JZGMNHS.png";
  import LES from "../assets/schoolsImages/LES.png";
  import LES2 from "../assets/schoolsImages/LES2.png";
  import MEES from "../assets/schoolsImages/MEES.png";
  import MES from "../assets/schoolsImages/MES.png";
  import MES2 from "../assets/schoolsImages/MES2.png";
  import MNHS from "../assets/schoolsImages/MNHS.png";
  import NRJNHS from "../assets/schoolsImages/NRJ-NHS.png";
  import OLES from "../assets/schoolsImages/OLES.png";
  import PES from "../assets/schoolsImages/PES.png";
  import PHEMS from "../assets/schoolsImages/PHEMS.png";
  import PENP from "../assets/schoolsImages/PENP.png";
  import SAIS from "../assets/schoolsImages/SAIS.png";
  import SFNHS from "../assets/schoolsImages/SFNHS.png";
  import SFES from "../assets/schoolsImages/SFES.png";
  import SVES from "../assets/schoolsImages/SVES.png";
  import SSES from "../assets/schoolsImages/SSES.png";
  import S5ES from "../assets/schoolsImages/S5ES.png";
  import S5AES from "../assets/schoolsImages/S5AES.png";
  import S5AINHS from "../assets/schoolsImages/S5AINHS.png";
  import STES from "../assets/schoolsImages/STES.png";
  import TES from "../assets/schoolsImages/TES.png";
  import TATMES from "../assets/schoolsImages/TATMES.png";
  import TES2 from "../assets/schoolsImages/TES2.png";
  import ZES from "../assets/schoolsImages/ZES.png";
  import { createSlug } from "../utils/idGenerator";

  export const rawSchoolAccounts = [
    {
      school_name: "Biñan City Science & Technology High School",                      
      school_address: "Silmer Village San Francisco, Biñan City, Laguna, 4024",     
      logo: BCSTHS,
    },
    {
      school_name: "Biñan City Senior High School-San Antonio Campus",
      school_address: "Escueta St., San Antonio, Biñan City, Laguna, 4024",   
      logo: BCSHSSAC,
    },
    {
      school_name: "Biñan City Senior High School-Sto.Tomas Campus",
      school_address: "Tagbilaran St., Sussna Homes, Sto. Tomas, Biñan City, Laguna, 4024",
      logo: BCSHSSTC,
    },
    {
      school_name: "Biñan City Senior High School-Timbao Campus",
      school_address: "La Solidaridad Estate Homes Timbao,  Biñan City, Laguna, 4024",
      logo: BCSHSTC,
    },
    {
      school_name: "Biñan City Senior High School-West Campus",
      school_address: "Purok 3, Langkiwa, Biñan City, Laguna, 4024",
      logo: BCSHSWC,
    },
    {
      school_name: "Biñan Elementary School",
      school_address: "P. Burgos St., Sto. Domingo, Biñan City, Laguna, 4024",
      logo: BES,
    },
    {
      school_name: "Biñan Integrated National High School",
      school_address: "Nong Sto. Domingo, Biñan City, Laguna, 4024",
      logo: BINHS,
    },
    {
      school_name: "Biñan Secondary School of Applied Academics",
      school_address: "Purok 3 Brgy. Sto. Tomas, Biñan City, Laguna, 4024",
      logo: BSSAA,
    },
    {
      school_name: "Canlalay Elementary School",
      school_address: "Maribel Subd, Canlalay, Biñan City, Laguna, 4024",
      logo: CES,
    },
    {
      school_name: "Dela Paz Main Elementary School",
      school_address: "P. Paterno St., Dela Paz, Biñan City, Laguna, 4024",
      logo: DPESM,
    },
    {
      school_name: "Dela Paz National High School",
      school_address: "Almeda Subd, Dela Paz, Biñan City, Laguna, 4024",
      logo: DPNHS,
    },
    {
      school_name: "Dela Paz West Elementary School",
      school_address: "Almeda Subd, Dela Paz, Biñan City, Laguna, 4024",
      logo: DPESW,
    },
    {
      school_name: "Dr. Jose G. Tamayo Memorial Elementary School",
      school_address: "Purok 4 Sto. Niño, Biñan City, Laguna, 4024",
      logo: DJTMES,
    },
    {
      school_name: "Dr. Marcelino Z. Batista Memorial Elementary School",
      school_address: "Batist Subd, San Jose, Biñan City, Laguna, 4024",
      logo: DMZBMES,
    },
    {
      school_name: "Ganado Elementary School",
      school_address: "Ganado, Biñan City, Laguna, 4024",
      logo: GES,
    },
    {
      school_name: "Jacobo Z Gonzales Memorial National High School",
      school_address: "Romana Subd., San Antonio, Biñan City, Laguna, 4024",
      logo: JZGMNHS,
    },
    {
      school_name: "Langiwa Elementary School",
      school_address: "Purok 2 Langkiwa, Biñan City, Laguna, 4024",
      logo: LES,
    },
    {
      school_name: "Loma Elementary School",
      school_address: "Catleya St., Loma, Biñan City, Laguna, 4024",
      logo: LES2,
    },
    {
      school_name: "Malaban Elementary School",
      school_address: "Ilaya St., Malaban, Biñan City, Laguna, 4024",
      logo: MES2,
    },
    {
      school_name: "Malaban East Elementary School",
      school_address: "Purok 2 Mamplasan, Biñan City, Laguna, 4024",
      logo: MEES,
    },
    {
      school_name: "Mamplasan Elementary School",
      school_address: "Purok 2 Mamplasan, Biñan City, Laguna, 4024",
      logo: MES,
    },
    {
      school_name: "Mamplasan National High School",
      school_address: "B6, L5 ST. Rose Village 2 Brgy. Casile, Biñan City, Laguna, 4024",
      logo: MNHS,
    },
    {
      school_name: "Nereo R. Joaquin Memorial National High School",
      school_address: "B6, L5 ST. Rose Village 2 Brgy. Casile, Biñan City, Laguna, 4024",
      logo: NRJNHS,
    },
    {
      school_name: "Our Lady of Lourdes Elementary School",
      school_address: "B6, L5 ST. Rose Village 2 Brgy. Casile, Biñan City, Laguna, 4024",
      logo: OLES,
    },
    {
      school_name: "Pagkakaisa Elementary School",
      school_address: "Romana Subd., San Antonio, Biñan City, Laguna, 4024",
      logo: PES,
    },
    {
      school_name: "Pedro H. Escueta Memorial Elementary School",
      school_address: "Bing St., Garcia San Antonio, Biñan City, Laguna, 4024",
      logo: PHEMS,
    },
    {
      school_name: "Platero Elementary School",
      school_address: "Nielo St. Platero, Biñan City, Laguna, 4024",
      logo: PENP,
    },
    {
      school_name: "Saint Anthony Integrated School",
      school_address: "St. Franciss VII, San Antonio, Biñan, Laguna",
      logo: SAIS,
    },
    {
      school_name: "Saint Francis Integrated National High School",
      school_address: "Tuklas St., Halang Rd. Brgy. San Francisco, Biñan City, Laguna, 4024",
      logo: SFNHS,
    },
    {
      school_name: "San Francisco Elementary School",
      school_address: "Tuklas St., San Francisco, Biñan City, Laguna, 4024",
      logo: SFES,
    },
    {
      school_name: "San Vicente Elementary School",
      school_address: "Malvar St., San Vicente, Biñan City, Laguna, 4024",
      logo: SVES,
    },
    {
      school_name: "Soro-Soro Elementary School",
      school_address: "4 Soro-Soro, Biñan City, Laguna, 4024",
      logo: SSES,
    },
    {
      school_name: "Southville 5 Elementary School",
      school_address: "B25, L2 Timbao, Biñan City, Laguna, 4024",
      logo: S5ES,
    },
    {
      school_name: "Southville 5A Elementary School",
      school_address: "Southville 5A Langkiwa, Biñan City, Laguna, 4024",
      logo: S5AES,
    },
    {
      school_name: "Southville 5A National High School",
      school_address: "Southville 5A Langkiwa, Biñan City, Laguna, 4024",
      logo: S5AINHS,
    },
    {
      school_name: "Sto.Tomas Elementary School",
      school_address: "Purok 5 Sto. Tomas, Biñan City, Laguna, 4024",
      logo: STES,
    },
    {
      school_name: "Timbao Elementary School",
      school_address: "Purok 2, Timbao, Biñan City, Laguna, 4024",
      logo: TES,
    },
    {
      school_name: "Tomas A. Turalba Main Elementary School",
      school_address: "China St., Town & Country Southville Subd, Sto. Tomas, Biñan City, Laguna, 4024",
      logo: TATMES,
    },
    {
      school_name: "Tubigan Elementary School",
      school_address: "Purok 3 Brgy. Tubigan, Biñan City, Laguna, 4024",
      logo: TES2,
    },
    {
      school_name: "Zapote Elementary School",
      school_address: "Zapote, Biñan City, Laguna, 4024",
      logo: ZES,
    },
  ];

  export const schoolAccounts = rawSchoolAccounts.map(school => {
  // Keep only accounts that match parent school_name & school_address
  const validAccounts = (school.accounts || []).filter(account =>
    account.school_name === school.school_name &&
    account.school_address === school.school_address
  );

  return {
    ...school,
    slug: createSlug(school.school_name),
    accounts: validAccounts, // overwrite with only valid accounts
  };
});
