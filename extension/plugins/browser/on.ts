/**
 * @description enable extensions/apps
 * @author tomasy
 * @email solopea@gmail.com
 */

import { StewardApp } from 'common/type';
import { getURL } from 'helper/extension.helper';
import { t } from 'helper/i18n.helper';
import { Command, Plugin, Type } from 'plugins/type';

export default function(Steward: StewardApp): Plugin {
  const { chrome, util } = Steward;

  const version = 2;
  const name = 'onExtension';
  const key = 'on';
  const type: Type = 'keyword';
  const icon = getURL('iconfont/on.svg');
  const title = t(`${name}_title`);
  const subtitle = t(`${name}_subtitle`);
  const commands: Command[] = [
    {
      key,
      type,
      title,
      subtitle,
      icon,
      editable: true,
    },
  ];

  function setEnabled(id, enabled) {
    chrome.management.setEnabled(id, enabled, function() {});
  }

  function getExtensions(query, enabled, callback) {
    chrome.management.getAll(function(extList) {
      const matchExts = extList.filter(function(ext) {
        return (
          ext.type === 'extension' &&
          util.matchText(query, ext.name) &&
          ext.enabled === enabled
        );
      });

      callback(matchExts);
    });
  }

  function dataFormat(rawList) {
    return rawList.map(function(item) {
      const url =
        item.icons instanceof Array
          ? item.icons[item.icons.length - 1].url
          : '';
      const isWarn = item.installType === 'development';

      return {
        key,
        id: item.id,
        icon: url,
        title: item.name,
        desc: item.description,
        isWarn,
      };
    });
  }

  function onInput(query) {
    return new Promise(resolve => {
      getExtensions(query.toLowerCase(), false, function(matchExts) {
        resolve(dataFormat(matchExts));
      });
    });
  }

  function onEnter(item) {
    if (item && item.id) {
      setEnabled(item.id, true);
      window.slogs.push(`Enable: ${item.title}`);
      Steward.app.refresh();
    }
  }

  return {
    version,
    name: 'Enable Extension',
    category: 'browser',
    icon,
    title,
    commands,
    onInput,
    onEnter,
    canDisabled: false,
  };
}
