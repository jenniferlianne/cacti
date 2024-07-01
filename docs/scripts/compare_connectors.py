import csv
import os.path
import subprocess
import json
import numpy as np

def get_openapi_files(root_dir):
    openapi_files = []
    for dirpath, dirnames, filenames in os.walk(root_dir + "/dist"):
        for filename in [f for f in filenames if f.endswith("openapi.json")]:
            openapi_files.append(os.path.join(dirpath, filename))
    return openapi_files

def get_connector_packages():
    connector_packages = []
    package_list_str = subprocess.run(["npx lerna ls --json"], shell=True, capture_output=True, text=True)
    for package in json.loads(package_list_str.stdout):
        package_name = package['name']
        if 'connector' in package_name and not 'test' in package_name:
            connector_packages.append(package)
    return connector_packages

def sort_paths_by_usage(paths):    
    # sort paths so that most popular ones come first
    popular = {}
    for path, packages_containing in paths.items():
        popular[path] = len(packages_containing)
    keys = list(popular.keys())
    values = list(popular.values())
    sorted_value_index = np.argsort(values)
    sorted_dict = {keys[i]: values[i] for i in sorted_value_index}
    popular_paths = list(sorted_dict.keys())
    popular_paths.reverse()
    return popular_paths

def compute_paths_with_consistent_syntax(paths):
    consistent_syntax = {}
    for path, packages_containing in paths.items():
        unique_specs = []
        for package_containing in packages_containing:
            spec = package_containing['path_spec']
            remove_keys_recursively(spec,['summary','description','path','example'])
            spec = json.dumps(spec)
            if not spec in unique_specs:
                unique_specs.append(spec)
        consistent_syntax[path] = len(unique_specs) == 1 
    return consistent_syntax

def remove_keys_recursively(dict_obj, keys):
    for key in list(dict_obj.keys()):
        if not isinstance(dict_obj, dict):
            continue
        elif key in keys:
            dict_obj.pop(key, None)
        elif isinstance(dict_obj[key], dict):
            remove_keys_recursively(dict_obj[key], keys)
        elif isinstance(dict_obj[key], list):
            for item in dict_obj[key]:
                remove_keys_recursively(item, keys)
    return

def package_shortname(longname):
    ln = longname.replace('@hyperledger/cactus-plugin-ledger-connector-','')
    ln = ln.replace('@hyperledger/cacti-plugin-ledger-connector-','')
    return ln

paths = {}
package_names = []

connector_packages  = get_connector_packages()
for package in connector_packages:
    package_name = package_shortname(package['name'])
    package_names.append(package_name)
    print(package_name)
    for openapi_file in get_openapi_files(package['location']):
        with open(openapi_file, 'r') as f:
            api_spec = json.load(f)
            for path, path_spec in api_spec['paths'].items():
                #print(path_spec)
                print(f"{package_name},{path}")
                base = path.split('/')[-1]
                if not '{' in base:
                    if not base in paths:
                        paths[base] = []
                    paths[base].append({'package_name': package_name, 'path_spec': path_spec })


popular_paths = sort_paths_by_usage(paths)
path_syntax_check = compute_paths_with_consistent_syntax(paths)

with open('compare_connectors.csv', 'w', newline='\n') as csvfile:
    csv_file = csv.writer(csvfile)
    
    csv_file.writerow(['', 'Consistent Syntax','# Packages'] + package_names)
    for path in popular_paths:
        path_row = [path,path_syntax_check[path], len(paths[path])]
        all_packages_implementing = [ sub['package_name'] for sub in paths[path] ]
        for package_name in package_names:
            if package_name in all_packages_implementing:
                path_row.append('x')
            else:
                path_row.append(None)
        csv_file.writerow(path_row)

for package in paths['invoke-raw-web3eth-method']:
    print(package['path_spec'])
