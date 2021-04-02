(
  if [ "$BUILD_ENV" = "lambdacraft" ]; then
    yarn workspace front-end build
  elif [ "$BUILD_ENV" = "lambdacraft-api" ]; then
    yarn workspace back-end build
  else
    echo "Error: no build config for INATO_BUILD_ENV value '$INATO_BUILD_ENV'"
    exit 1
  fi
)