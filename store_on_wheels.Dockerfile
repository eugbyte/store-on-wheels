#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/storeonwheels.client/*", "storeonwheels.client/"]
COPY ["src/StoreOnWheels.Server/*", "StoreOnWheels.Server/"]
WORKDIR "/src/storeonwheels.client"
RUN npm i
RUN npm run build
WORKDIR "/src/StoreOnWheels.Server"
RUN dotnet restore "./StoreOnWheels.Server.csproj"
RUN dotnet build "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
WORKDIR /src
COPY --from=build src .
RUN ls
RUN ls storeonwheels.client
RUN ls storeonwheels.client/node_modules
WORKDIR "/src/storeonwheels.client"
RUN npm i
WORKDIR "/src/StoreOnWheels.Server"
RUN ls
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
COPY --from=publish /app/publish .
WORKDIR /app
ENTRYPOINT ["dotnet", "StoreOnWheels.Server.dll"]
