export class WorkspaceResponse {
  public readonly name: string;
  public readonly id: string;
}

export class WorkspacesResponseDto {

  public readonly workspaces: WorkspaceResponse[];

}
