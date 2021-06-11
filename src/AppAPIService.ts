import axios from "axios";
import { FileFolderPath } from "./ServiceContract";

class AppAPIService {
  constructor() {
    axios.create({
      baseURL: process.env.apiURI,
    });
  }

  public async getFileServerDirectory(): Promise<FileFolderPath> {
    return (await axios.get("FSD")).data;
  }
}

const instance = new AppAPIService();
export { instance as AppAPIService };
