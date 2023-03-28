import axios from "axios";
import { TransformersCookieResponse } from "../interface/TransformersResponse";

export const analyzeCookieMessage = async (text: string): Promise<TransformersCookieResponse> => {
  const { data } = await axios.post<TransformersCookieResponse>(
    `http://${process.env.TRANSFORMERS_SERVER_ADDRESS}/cookie`,
    {
      text
    }
  );

  return data;
};
