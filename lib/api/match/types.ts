export interface MatchHealthResponse {
  status: string;
  service: string;
  algorithm_version?: string;
  matching_source?: string;
  canonical_source?: string;
}
