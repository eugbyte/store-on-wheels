#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR / app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with-node
RUN apt-Get update
RUN apt-Get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-Get -y install nodejs

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION = Release
WORKDIR / src
RUN ls
COPY ["src/StoreOnWheels.Server/StoreOnWheels.Server.csproj", "StoreOnWheels.Server/"]
RUN dotnet restore "./StoreOnWheels.Server/StoreOnWheels.Server.csproj"
COPY. .
WORKDIR "/src/storeonwheels.client"
RUN dotnet build "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build As publish
ARG BUILD_CONFIGURATION = Release
RUN dotnet publish "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost = False

FROM base As final
WORKDIR / app
COPY --from = publish / app / publish.
ENTRYPOINT ["dotnet", "StoreOnWheels.Server.dll"]
