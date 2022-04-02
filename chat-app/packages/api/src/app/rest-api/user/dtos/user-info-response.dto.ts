import { WorkspaceResponse } from "../../workspace/dtos/response/workspaces-response.dto";

export class UserInfoResponseDto {
    public readonly workspaces: WorkspaceResponse[];
}
