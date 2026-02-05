export interface School {
  code: string;
  name: string;
  programmes: string[];
  revision: string;
  parentRevision: string;
  components?: {
    [key: string]: any
  };
  committed: {
    on: Date | null;
    by: string;
  };
}

export interface AttrDesc {
  attribute: string;
  descriptor: string;
}

export interface Wk extends AttrDesc {  }

export interface Wp extends AttrDesc { }

export interface Ea extends AttrDesc { }
