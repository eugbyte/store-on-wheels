#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["StoreOnWheels.Server/StoreOnWheels.Server.csproj", "StoreOnWheels.Server/"]
RUN dotnet restore "./StoreOnWheels.Server/StoreOnWheels.Server.csproj"
COPY . .
RUN ls
WORKDIR "/src/StoreOnWheels.Server"
RUN dotnet build "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build As publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./StoreOnWheels.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=False