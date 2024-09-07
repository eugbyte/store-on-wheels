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

# mimicks the right click docker build in visual studio, simplified in docker-compose.yml
docker:
	docker build \
	--file ./src/StoreOnWheels.Server/Dockerfile \
	--progress=plain \
	--force-rm -t storeonwheelsserver \
	--build-arg "BUILD_CONFIGURATION=Debug" \
	--label "com.microsoft.created-by=visual-studio" \
	--label "com.microsoft.visual-studio.project-name=StoreOnWheels.Server" \
	src

compose:
	docker compose rm -fsv && docker compose up -d 

compose-down:
	docker compose down

renegerate-sqlite:
	rm -f src/StoreOnWheels.Server/StoreOnWheels.db
	cd src/StoreOnWheels.Server && dotnet tool restore
	cd src/StoreOnWheels.Server && dotnet ef database update # creates the StoreOnWheels.db, which was docker ignored. \