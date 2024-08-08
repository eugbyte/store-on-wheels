install:
	dotnet restore --property WarningLevel=0
	cd src/storeonwheels.client && npm i

start:
	dotnet run --project=src/StoreOnWheels.Server/StoreOnWheels.Server.csproj

test:
	dotnet test
	cd src/storeonwheels.client && npm run test

format:
	dotnet format --diagnostics --severity info  
	cd src/storeonwheels.client && npm run fmt

docker:
	docker build \
	-f src/StoreOnWheels.Server/StoreOnWheels.Server.csproj \
	--force-rm -t angularapp1server:dev \
	--target base  \
	--build-arg "BUILD_CONFIGURATION=Debug" \
	--label "com.microsoft.created-by=visual-studio" \
	--label "com.microsoft.visual-studio.project-name=StoreOnWheels.Server" \
	.
