install:
	dotnet restore --property WarningLevel=0
	cd src/storeonwheels.client && npm i

start:
	dotnet run --project=src/StoreOnWheels.Server/StoreOnWheels.Server.csproj

test:
	dotnet test
	cd src/storeonwheels.client && npm run test
