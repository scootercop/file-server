import { Component } from "react";
import { AppAPIService } from "./AppAPIService";
import { AppStore } from "./AppStore";
import { FolderView } from "./FolderView";

export class App extends Component {
  public async componentDidMount() {
    AppStore.fileFolderStructure = await AppAPIService.getFileServerDirectory();
  }

  public render() {
    return <FolderView />;
  }
}
