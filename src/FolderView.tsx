import {
  ActionButton,
  DetailsList,
  DetailsListLayoutMode,
  FabricBase,
  FontIcon,
  IColumn,
  IconButton,
  IIconProps,
  Link,
  mergeStyleSets,
  SelectionMode,
  Stack,
  StackItem,
} from "@fluentui/react";
import { action, computed, Lambda, observable, reaction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { AppStore } from "./AppStore";
import { HelperFunctions } from "./HelperFunctions";
import { FileFolderPath, FileFolderType } from "./ServiceContract";

@observer
export class FolderView extends React.Component {
  @observable private _currentFolder: FileFolderPath;

  private disposer: Lambda;

  private set currentFolder(value: FileFolderPath) {
    this._currentFolder = value;
  }

  @computed
  private get currentFolder() {
    return this._currentFolder;
  }

  constructor(props: any) {
    super(props);
    this._currentFolder = AppStore.fileFolderStructure;
    this.disposer = reaction(
      () => AppStore.fileFolderStructure,
      () => {
        this._currentFolder = AppStore.fileFolderStructure;
      }
    );
  }

  componentWillUnmount() {
    this.disposer();
  }

  public render() {
    return (
      <FabricBase>
        <Stack className="Panel">
          <StackItem>
            <ActionButton
              iconProps={this.goBackIcon}
              onClick={this.goBack}
              disabled={this.backButtondisabled()}
            >
              Back
            </ActionButton>
          </StackItem>
          <StackItem>
            <Stack className="Panel">
              <StackItem>{this.currentFolder.relativePath}</StackItem>
              <StackItem>
                <DetailsList
                  items={this.currentFolder.children as FileFolderPath[]}
                  columns={this.columns}
                  selectionMode={SelectionMode.none}
                  layoutMode={DetailsListLayoutMode.justified}
                  isHeaderVisible={true}
                />
              </StackItem>
            </Stack>
          </StackItem>
        </Stack>
      </FabricBase>
    );
  }

  private classNames = mergeStyleSets({
    fullCenterAlign: {
      display: "flex  !important",
      justifyContent: "center !important",
      alignItems: "center !important",
      fontSize: "15px",
    },
    verticalCenterAlign: {
      display: "flex  !important",
      alignItems: "center !important",
      fontSize: "15px",
    },
    maxWidth: {
      minWidth: "400",
    },
  });
  downloadIcon: IIconProps = { iconName: "Download" };

  private columns: IColumn[] = [
    {
      key: "download",
      name: "Download",
      minWidth: 65,
      maxWidth: 65,
      className: this.classNames.fullCenterAlign,
      onRender: (item: FileFolderPath) => {
        return (
          <>
            {(item.ext === ".mp4" || item.ext === ".m4a") && (
              <Link onClick={() => this.copyLink(item)}>
                <FontIcon iconName="Copy" />
              </Link>
            )}
            {item.type === FileFolderType.File && (
              <a
                href={HelperFunctions.changeSlash(item.relativePath)}
                download={item.name}
                rel="noreferrer"
              >
                <IconButton iconProps={this.downloadIcon} />
              </a>
            )}
            {item.type === FileFolderType.Folder && (
              <IconButton
                iconProps={this.downloadIcon}
                onClick={() => HelperFunctions.downloadFolder(item)}
              />
            )}
          </>
        );
      },
    },
    {
      key: "fileType",
      name: "File Type",
      fieldName: "type",
      minWidth: 60,
      maxWidth: 65,
      className: this.classNames.fullCenterAlign,
      onRender: (item: FileFolderPath) => (
        <FontIcon
          iconName={item.type === FileFolderType.File ? "OpenFile" : "Folder"}
        />
      ),
    },
    {
      key: "name",
      name: "File Name",
      fieldName: "name",
      className: this.classNames.verticalCenterAlign,
      minWidth: 200,
      onRender: (item: FileFolderPath) => {
        return (
          <>
            {item.type === FileFolderType.Folder && (
              <Link
                key={item.path}
                onClick={() => this.handleFileFolderClicked(item)}
              >
                {item.name}
              </Link>
            )}
            {item.type === FileFolderType.File && (
              <a
                href={HelperFunctions.changeSlash(item.relativePath)}
                download={item.name}
                rel="noreferrer"
              >
                {item.name}
              </a>
            )}
          </>
        );
      },
    },
    {
      key: "size",
      name: "Size",
      className: this.classNames.verticalCenterAlign,
      minWidth: 80,
      onRender: (item: FileFolderPath) => {
        return item.type === FileFolderType.File
          ? HelperFunctions.fileSizeInText(item.size as string)
          : "";
      },
    },
  ];

  private goBack = () => {
    this.currentFolder =
      this.getParent(AppStore.fileFolderStructure, this.currentFolderPath) ||
      AppStore.fileFolderStructure;
  };

  private goBackIcon: IIconProps = {
    iconName: "Back",
  };

  private backButtondisabled = () => {
    return this.currentFolder.path === AppStore.fileFolderStructure.path;
  };

  private handleFileFolderClicked = (file: FileFolderPath) => {
    if (file.type === FileFolderType.Folder) {
      this.currentFolder = file;
    }
  };

  @computed
  private get currentFolderPath() {
    return this.currentFolder.path;
  }

  private getParent(data: FileFolderPath, path: string): FileFolderPath | null {
    const element = data.children.some((e) => e.path === path);
    if (element) {
      return data;
    } else {
      for (let item in data.children) {
        let mila = this.getParent(data.children[item], path);
        if (mila) return mila;
      }
      return null;
    }
  }

  private copyLink(item: FileFolderPath) {
    var textField = document.createElement("textarea");
    textField.innerText =
      window.location.origin + HelperFunctions.changeSlash(item.relativePath);
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }
}
