// browser plugins
import { StewardApp } from 'common/type';
import { getGlobalStewardAPI } from 'main/Steward';

import bookmark from './browser/bookmark';
import chrome from './browser/chrome';
import del from './browser/del';
import download from './browser/download';
import extensions from './browser/extensions';
import his from './browser/his';
import off from './browser/off';
import on from './browser/on';
import run from './browser/run';
import set from './browser/set';
import tab from './browser/tab';
import topsites from './browser/topsites';
// extension plugins
import wordcard from './extension/wordcard';
// other plugins
import calculate from './other/calculate';
import diary from './other/diary';
import note from './other/note';
import openurl from './other/openurl';
import pocket from './other/pocket';
import search from './other/search';
import todo from './other/todo';
import urlblock from './other/urlblock';
// steward plugins
import about from './steward/about';
import component from './steward/component';
import custom from './steward/custom';
import help from './steward/help';
import newtab from './steward/newtab';
import random from './steward/random';
import spm from './steward/spm';
import steward from './steward/steward';
import wallpaper from './steward/wallpaper';
import workflow from './steward/workflow';
import wsm from './steward/wsm';
import { Plugin, PluginFactory } from './type';

const pluginCreators: PluginFactory[] = [
  about,
  note,
  diary,
  tab,
  on,
  off,
  set,
  del,
  run,
  his,
  bookmark,
  todo,
  pocket,
  wordcard,
  calculate,
  urlblock,
  download,
  help,
  topsites,
  openurl,
  newtab,
  wallpaper,
  search,
  extensions,
  chrome,
  steward,
  custom,
  random,
  workflow,
  spm,
  wsm,
  component,
];

let plugins: Plugin[];

export function getPlugins(Steward: StewardApp, pluginsConfig?: any) {
  if (plugins) {
    return plugins;
  }
  function getPluginOptions(name: string) {
    if (pluginsConfig) {
      return pluginsConfig[name]?.options
    } else {
      return
    }
  }

  // orkey: original key
  plugins = pluginCreators.map((pluginCreator: PluginFactory) => {
    const options = getPluginOptions(pluginCreator.displayName || pluginCreator.name);
    const plugin: Plugin = pluginCreator(Steward, options);

    if (plugin.commands) {
      plugin.commands.forEach(command => {
        if (!command.orkey) {
          command.orkey = command.key;
        }
      });
    }

    if (plugin.canDisabled) {
      plugin.disabled = false;
    }

    return plugin;
  });

  return plugins;
}

export function getStaticPlugins() {
  return getPlugins(getGlobalStewardAPI())
}
