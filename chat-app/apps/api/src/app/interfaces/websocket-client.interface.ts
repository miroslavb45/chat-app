export interface IWebsocketClient extends WebSocket {
    id: string;
    isAuthenticated: boolean;
}