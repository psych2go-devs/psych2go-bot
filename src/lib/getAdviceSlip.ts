import axios from "axios";
import { AdviceSlipResponse } from "../interface/AdviceSlip";

export const getAdviceSlip = async () => {
  const { data } = await axios.get<AdviceSlipResponse>("https://api.adviceslip.com/advice");

  return data.slip;
};
