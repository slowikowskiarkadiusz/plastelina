using System;

namespace ExamplePlastelina.Extensions
{
    [AttributeUsage(System.AttributeTargets.Class | System.AttributeTargets.Struct | System.AttributeTargets.Enum)]
    public class BwsTopicAttribute : Attribute
    {
        public string TopicName { get; private set; }

        public BwsTopicAttribute(string topicName)
        {
            TopicName = topicName;
        }
    }
}
