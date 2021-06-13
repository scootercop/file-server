import { FileFolderPath, FileFolderType } from "../common/ServiceContract";

export module HelperFunctions {
  export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  export function changeSlash(link: string): string {
    if (link.indexOf("\\") > -1) {
      let parts = link.split("\\");
      parts.forEach((p, index) => (parts[index] = encodeURIComponent(p)));
      return parts.join("\\");
    } else {
      let parts = link.split("/");
      parts.forEach((p, index) => (parts[index] = encodeURIComponent(p)));
      return parts.join("/");
    }
  }

  export function fileSizeInText(size: string) {
    const k = 1024;
    const sizeInt = parseInt(size);
    const dm = 2;
    const sizes = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(sizeInt) / Math.log(k));

    return parseFloat((sizeInt / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  export function flatten(data: FileFolderPath[]) {
    return data.reduce((r: FileFolderPath[], { children, ...rest }) => {
      r.push(rest as FileFolderPath);
      if (children) r.push(...flatten(children));
      return r;
    }, []);
  }

  export async function downloadFolder(folder: FileFolderPath) {
    const filesForDownload = flatten(folder.children).filter(
      (x) => x.type === FileFolderType.File
    );
    for (var n = 0; n < filesForDownload.length; n++) {
      var temporaryDownloadLink = document.createElement("a");
      temporaryDownloadLink.style.display = "none";
      document.body.appendChild(temporaryDownloadLink);
      var download = filesForDownload[n];
      temporaryDownloadLink.setAttribute(
        "href",
        HelperFunctions.changeSlash(download.relativePath)
      );
      temporaryDownloadLink.setAttribute("download", download.name);
      temporaryDownloadLink.setAttribute("rel", "noreferrer");
      temporaryDownloadLink.setAttribute(
        "Content-Disposition",
        `attachment; filename= ${download.name}`
      );
      temporaryDownloadLink.click();
      document.body.removeChild(temporaryDownloadLink);
      await HelperFunctions.sleep(500);
    }
  }
}
