import { cacheStrategies, createEndpoint } from "@/configs";
import { GetUserByIdDto } from "./types";

const http = createEndpoint('/users');

export const user = {
  getById: async (userId: string): Promise<GetUserByIdDto> => 
    await http.get(`/${userId}`, {
      auth: true,
      ...cacheStrategies.static,
    }),
}