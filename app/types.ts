export interface Player {
  _id: string;
  name: string;
  sprintSpeed: MonthlyStat[];  // Changed from number to MonthlyStat[]
  verticalJump: MonthlyStat[]; // Changed from number to MonthlyStat[]
  startDate: Date;
  endDate: Date;
}

// ... rest of the file remains the same ...

  export interface MonthlyStat {
    month: string;
    value: number;
  }