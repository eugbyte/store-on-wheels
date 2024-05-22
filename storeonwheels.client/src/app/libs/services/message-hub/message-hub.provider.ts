import { MessageHubService } from "./message-hub.service";
import { Provider } from "@angular/core";
import { hubConnection } from "./create-connection";
import { MathService } from "~/app/libs/services/math/math.service";

export const messageHubProvider: Provider = {
  provide: MessageHubService,
  useFactory: () => new MessageHubService(new MathService(), hubConnection),
};
