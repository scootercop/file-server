import { FileFolderPath, FileFolderType } from "./ServiceContract";

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
    if (!size) return "";
    else return size + " KB";
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
