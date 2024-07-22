cmake_minimum_required(VERSION 3.12)
project(forgerySolve VERSION 1.0)
add_executable(forgerySolve main.cc)

add_subdirectory(bls12-381)

target_link_libraries(forgerySolve PUBLIC bls12-381)
target_include_directories(forgerySolve PUBLIC bls12-381/include)

target_compile_features(forgerySolve PUBLIC cxx_std_20)
target_compile_options(forgerySolve PRIVATE -Wall -Wextra -Wpedantic)
