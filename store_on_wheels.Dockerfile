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
RUN ls
RUN npm run build
WORKDIR "/src/StoreOnWheels.Server"
RUN dotnet restore "./StoreOnWheels.Server.csproj"
RUN dotnet publish "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS publish
COPY --from=build /app/publish .
WORKDIR /app
ENTRYPOINT ["dotnet", "StoreOnWheels.Server.dll"]
