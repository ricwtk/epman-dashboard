export interface School {
  code: string;
  name: string;
  programmes: string[];
  components?: object;
}

export interface AttDesc {
  attribute: string;
  descriptor: string;
}

export interface Wk extends AttDesc {  }

export interface Wp extends AttDesc { }

export interface Ea extends AttDesc { }
