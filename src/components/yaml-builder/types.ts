export interface ExcludeRowCondition {
  column: string;
  equals: string;
}

export interface SplitColumnConfig {
  column: string;
  delimiter: string;
}

export interface AutoGenerateIdConfig {
  enabled: boolean;
  field?: string;
  prefix: string;
  start: number;
}

export interface MergeSourceConfig {
  name?: string;
  spreadsheetId: string;
  gid: number;
  hierarchical_rows?: boolean;
  excludeColumns?: string[];
  excludeRowsWhere?: ExcludeRowCondition[];
  columnMapping?: Record<string, string>;
  defaults?: Record<string, string>;
  autoGenerateId?: AutoGenerateIdConfig;
  imageColumns?: string | string[];
}

export interface TabConfig {
  name: string;
  gid: number;
  hierarchical_rows?: boolean;
  excludeColumns?: string[];
  excludeRowsWhere?: ExcludeRowCondition[];
  splitColumns?: SplitColumnConfig[];
  imageColumns?: string | string[];
  aiSearch?: {
    enabled: boolean;
    titleColumns?: string[];
    metadataColumns?: string[];
  };
  autoGenerateId?: AutoGenerateIdConfig;
  mergeSources?: MergeSourceConfig[];
}

export interface JoinSource {
  gid: number;
  foreignKey: string;        // column in lookup tab matching primary tab's filter column
  groupByColumn: string;     // column in lookup tab whose values become group names
  displayColumn: string;     // column in lookup tab shown to user as label
  groupByDelimiter?: string; // delimiter if groupByColumn is multi-value (default ',')
  autoDiscover?: boolean;    // auto-build groups from data (default true)
}

export interface TaxonomyCategory {
  id: string;
  title: string;
  gid?: number;
  linkType?: 'join';
  joinSource?: JoinSource;
  groups: Record<string, string[]>; // manual override groups (values = foreign key values)
}

export interface SheetConfig {
  name: string;
  spreadsheetId: string;
  tabs: TabConfig[];
  filterTaxonomy?: TaxonomyCategory[];
}

export interface RinkConfig {
  frontendBaseUrl?: string;
  sheets: SheetConfig[];
}
