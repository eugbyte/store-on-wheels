#See https://aka.ms/customizecontainer To learn how To customize your debug container And how Visual Studio uses this Dockerfile To build your images For faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with_node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs

FROM with_node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["StoreOnWheels.Server/StoreOnWheels.Server.csproj", "StoreOnWheels.Server/"]
RUN dotnet restore "./StoreOnWheels.Server/StoreOnWheels.Server.csproj"
COPY . .
RUN ls storeonwheels.client
WORKDIR "/src/StoreOnWheels.Server"
RUN dotnet build "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=False

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StoreOnWheels.Server.dll"]
