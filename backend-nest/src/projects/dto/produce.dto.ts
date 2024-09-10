export class ProduceDto {
  //  TODO
  tracks: {
    trackId: number;
    trackName: string;
    params?: any;
    sheet: {
      id: number;
      startTime: number;
      duration: number;
      frequency: number;
      isActive: boolean;
      lyrics: string;
      lyricsAliasMapper: string;
      breakpoints?: any[];
    }[];
  }[];
}
